import { SetMetadata } from '@nestjs/common';

export const Role = (args: string[]) => SetMetadata('roles', args);