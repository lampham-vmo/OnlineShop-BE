import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreatePaymentMethodDto,
  PaymentMethodResponseDto,
} from './dto/payment-method.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EStatusPaymentMethod,
  PaymentMethod,
} from './entities/payment-method.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  private transformToDTO<T, V>(
    classType: new () => T,
    plainData: V | V[],
  ): T | T[] {
    return plainToInstance(classType, plainData, {
      excludeExtraneousValues: true,
    });
  }

  async create(
    createDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodResponseDto> {
    const paymentMethod = this.paymentMethodRepository.create(createDto);
    const result = await this.paymentMethodRepository.save(paymentMethod);

    return this.transformToDTO(
      PaymentMethodResponseDto,
      result,
    ) as PaymentMethodResponseDto;
  }

  async findAll(): Promise<PaymentMethodResponseDto[]> {
    const result = this.paymentMethodRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return this.transformToDTO(
      PaymentMethodResponseDto,
      result,
    ) as Array<PaymentMethodResponseDto>;
  }

  async updateStatus(
    id: number,
    status: EStatusPaymentMethod,
  ): Promise<PaymentMethodResponseDto> {
    if (!Object.values(EStatusPaymentMethod).includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    paymentMethod.status = status;
    const result = this.paymentMethodRepository.save(paymentMethod);
    return this.transformToDTO(
      PaymentMethodResponseDto,
      result,
    ) as PaymentMethodResponseDto;
  }
}
