import { Expose } from 'class-transformer';

export class CategoryResponse {
  @Expose()
  name: string;
}
