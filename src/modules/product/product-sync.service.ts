import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductResponse } from './DTO/response/product.response';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './Entity/product.entity';
import { Repository } from 'typeorm';
import { SearchService } from './search.service';

@Injectable()
export class ProductSyncService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly searchService: SearchService,
  ) {}

  async onModuleInit() {
    Logger.log('[Sync] Start syncing products with Elasticsearch...');

    const products = await this.productRepository.find({
      relations: ['category'],
      where: { isDeleted: false }, // Chỉ sync sản phẩm còn hoạt động
    });

    const productDocs = products.map((p) => {
      const priceAfterDis = p.price - (p.price * p.discount) / 100;
      return plainToInstance(
        ProductResponse,
        {
          ...p,
          priceAfterDis,
          categoryName: p.category?.name,
        },
        { excludeExtraneousValues: true },
      );
    });

    for (const doc of productDocs) {
      try {
        await this.searchService.indexProduct(doc);
      } catch (err) {
        Logger.error(
          `[Sync] Failed to index product ${doc.id}: ${err.message}`,
        );
      }
    }

    Logger.log(
      `[Sync] Synced ${productDocs.length} products to Elasticsearch.`,
    );
  }
}
