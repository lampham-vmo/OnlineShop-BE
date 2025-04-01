import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RouteName } from './common/decorators/route-name.decorator';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Post('ok')
  @RouteName('post something')
  postST(){}
}
