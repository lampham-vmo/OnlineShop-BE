import { OmitType, PartialType } from "@nestjs/mapped-types";
import { ProductRequest } from "./requests/product.request";

export class ProductUpdateDto extends PartialType(
    OmitType(ProductRequest, ['categoryId']),
) {}