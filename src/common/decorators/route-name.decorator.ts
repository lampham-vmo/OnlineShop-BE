import { SetMetadata } from '@nestjs/common';

export const RouteName = (name: string) => SetMetadata('routeName', name);
