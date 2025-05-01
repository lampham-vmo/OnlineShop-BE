import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { APIResponseDTO } from '../dto/response-dto';

export const ApiResponseWithModel = <TModel extends Type>(
  model: TModel,
  status = 200,
) => {
  return applyDecorators(
    ApiExtraModels(APIResponseDTO, model),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(APIResponseDTO) },
          {
            type: 'object',
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiResponseWithArrayModel = <TModel extends Type>(
  model: TModel,
  status = 200,
) => {
  return applyDecorators(
    ApiExtraModels(APIResponseDTO, model),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(APIResponseDTO) },
          {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};

type PrimitiveType = 'string' | 'number' | 'boolean';

export function ApiResponseWithPrimitive(
  primitiveType: PrimitiveType,
  status = 200,
) {
  return applyDecorators(
    ApiExtraModels(APIResponseDTO),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(APIResponseDTO) },
          {
            type: 'object',
            properties: {
              data: {
                type: primitiveType,
              },
            },
          },
        ],
      },
    }),
  );
}
