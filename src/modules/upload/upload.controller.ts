import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { ApiBody, ApiConsumes, ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { APIResponseDTO } from 'src/common/dto/response-dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload-file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary'
          }
        },
        required: ['file'],
      },
    })
  @ApiExtraModels(APIResponseDTO)
    @ApiResponse({status: 200, schema: {
      allOf: [
        { $ref: getSchemaPath(APIResponseDTO)},
        {
          type: 'object',
          properties: {
            data: {
              type: 'string'
            }
          }
        }
      ]
    }})
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadImageFile(file);
  }
}
