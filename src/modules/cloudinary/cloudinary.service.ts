import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary/cloudinary-response';
import * as streamifier from 'streamifier';
import { APIResponseDTO } from 'src/common/dto/response-dto';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadImageFile(
    file: Express.Multer.File,
  ): Promise<APIResponseDTO<string> | BadRequestException> {
    try {
      const { secure_url } = await this.uploadFile(file);
      return {
        success: true,
        statusCode: 200,
        data: secure_url,
      };
    } catch (error) {
      return new BadRequestException({ message: error });
    }
  }
}
