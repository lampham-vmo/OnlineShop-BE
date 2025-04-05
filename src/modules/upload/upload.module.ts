import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [CloudinaryModule],
  controllers: [UploadController],
  providers: [JwtService],
})
export class UploadModule {}
