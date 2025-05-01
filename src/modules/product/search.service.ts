import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ProductResponse } from './DTO/response/product.response';
import { ProductPagingResponse } from './DTO/response/product.paging.response';

@Injectable()
export class SearchService {
  constructor(private readonly esService: ElasticsearchService) {}

  public async createIndex() {
    const index = 'product';
    const checkIndex = await this.esService.indices.exists({ index });
    if (!checkIndex) {
      this.esService.indices.create({
        index,
        body: {
          mappings: {
            properties: {
              id: {
                type: 'keyword',
              },
              name: {
                type: 'text',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
              price: {
                type: 'float',
              },
              stock: {
                type: 'integer',
              },
              discount: {
                type: 'float',
              },
              image: {
                type: 'text',
                index: false,
              },
              priceAfterDis: {
                type: 'float',
              },
              categoryName: {
                type: 'text',
                fields: {
                  keyword: {
                    type: 'keyword',
                  },
                },
              },
              description: {
                type: 'text',
              },
              createAt: {
                type: 'date',
              },
            },
          },
          settings: {
            analysis: {
              filter: {
                autocomplete_filter: {
                  type: 'edge_ngram',
                  min_gram: 1,
                  max_gram: 20,
                },
              },
              analyzer: {
                autocomplete: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'autocomplete_filter'],
                },
              },
            },
          },
        },
      });
    }
  }

  public async indexProduct(product: ProductResponse) {
    return await this.esService.index({
      index: 'product',
      id: product.id.toString(),
      body: product,
    });
  }

  public async updateCategoryNameToNullInES(categoryName: string) {
    const index = 'product';

    const response = await this.esService.updateByQuery({
      index,
      body: {
        script: {
          source: 'ctx._source.categoryName = null', // Hoặc: 'ctx._source.categoryName = ""'
          lang: 'painless',
        },
        query: {
          term: {
            'categoryName.keyword': categoryName, // dùng keyword để so sánh chính xác
          },
        },
      },
      refresh: true,
    });
  }

  public async updateProductPartial(
    productId: number,
    updateFields: ProductResponse,
  ) {
    return await this.esService.update({
      index: 'product',
      id: productId.toString(),
      body: {
        doc: updateFields,
      },
    });
  }

  public async removeProduct(productId: number) {
    return await this.esService.deleteByQuery({
      index: 'product',
      body: {
        query: {
          match: {
            id: productId,
          },
        },
      },
    });
  }

  public async findProductForSearchBar(text: string) {
    const response = await this.esService.search({
      index: 'product',
      body: {
        query: {
          bool: {
            should: [
              {
                match_phrase_prefix: {
                  name: text,
                },
              },
              {
                match_phrase_prefix: {
                  category: text,
                },
              },
            ],
            minimum_should_match: 1,
          },
        },
        aggs: {
          auto_complete: {
            terms: {
              field: 'name.keyword',
              order: { _count: 'desc' },
              size: 10,
            },
          },
        },
      },
    });
    const product = response.hits.hits.map(
      (hit) => hit._source as ProductResponse,
    );
    return product;
  }

  public async findProductForPaging(
    text: string,
    page: number = 1,
    orderField: string = 'price',
    orderBy: string = 'asc',
  ) {
    const pageSize = 10;
    const from = (page - 1) * pageSize;
    const response = await this.esService.search({
      body: {
        from: from,
        size: pageSize,
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query: text,
                  fields: ['name', 'category'],
                  fuzziness: 'AUTO',
                },
              },
              {
                match_phrase_prefix: {
                  name: text,
                },
              },
              {
                match_phrase_prefix: {
                  category: text,
                },
              },
            ],
            minimum_should_match: 1,
          },
        },
        sort: [
          {
            [orderField]: {
              order: orderBy.toLowerCase() === 'asc' ? 'asc' : 'desc',
            },
          },
        ],
      },
    });
    const totalItems =
      typeof response.hits.total === 'object'
        ? response.hits.total.value
        : response.hits.total || 0;
    const totalPages = Math.ceil(totalItems / pageSize);
    const product = response.hits.hits.map(
      (hit) => hit._source as ProductResponse,
    );
    let pagination = {
      currentPage: +page,
      pageSize: pageSize,
      totalPages: totalPages,
      totalItems: totalItems,
    };
    return new ProductPagingResponse(product, pagination);
  }
}
