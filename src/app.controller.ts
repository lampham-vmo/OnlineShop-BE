import { Controller, Post, UseGuards } from '@nestjs/common';
import { RouteName } from './common/decorators/route-name.decorator';
import { AuthGuard } from './common/guard/auth.guard';
import { RoleGuard } from './common/guard/role.guard';

@Controller('/')
export class AppController {
  // constructor(private readonly appService: ) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Post('/dashboard')
  @UseGuards(AuthGuard, RoleGuard)
  @RouteName('post something')
  postST() {}
}
