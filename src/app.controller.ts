import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RouteName } from './common/decorators/route-name.decorator';
import { AuthGuard } from './common/guard/auth.guard';
import { RoleGuard } from './common/guard/role.guard';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('ok')
  @UseGuards(AuthGuard, RoleGuard)
  @RouteName('post something')
  postST() {}
}
