import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiError,
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} from '@paypal/paypal-server-sdk';

@Injectable()
export class PaypalService {
  private readonly client: Client;
  private readonly ordersController: OrdersController;

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID')!;
    const clientSecret = this.configService.get<string>(
      'PAYPAL_CLIENT_SECRET',
    )!;

    this.client = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: clientId,
        oAuthClientSecret: clientSecret,
      },
      timeout: 0,
      environment: Environment.Sandbox,
      logging: {
        logLevel: LogLevel.Info,
        logRequest: { logBody: true },
        logResponse: { logHeaders: false },
      },
    });

    this.ordersController = new OrdersController(this.client);
  }

  async createOrder(cart: { total: number }) {
    const collect = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: 'USD',
              value: `${Number(cart.total.toFixed(2))}`,
            },
          },
        ],
      },
      prefer: 'return=minimal',
    };

    try {
      const { body, ...httpResponse } =
        await this.ordersController.createOrder(collect);
      return {
        jsonResponse: JSON.parse(body as string),
        httpStatusCode: httpResponse.statusCode,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        const errorDetail = error.result['details'][0];
        throw new InternalServerErrorException({
          message: `${errorDetail.issue}`,
        });
      }
      throw new InternalServerErrorException({
        message: 'Failed to create order',
      });
    }
  }

  async captureOrder(orderID: string) {
    const collect = {
      id: orderID,
      prefer: 'return=minimal',
    };

    try {
      const { body, ...httpResponse } =
        await this.ordersController.captureOrder(collect);
      return {
        jsonResponse: JSON.parse(body as string),
        httpStatusCode: httpResponse.statusCode,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        const errorDetail = error.result['details'][0];
        throw new InternalServerErrorException({
          message: `${errorDetail.issue}`,
        });
      }
      throw new InternalServerErrorException({
        message: 'Failed to capture order',
      });
    }
  }
}
