import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  exports: [EmailService],
  imports: [],
  controllers: [],
  providers: [EmailService],
})
export class EmailModule {}
