import { ConfigurableModuleBuilder, Type } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaClientType } from './prisma.interfaces';

export interface PrismaModuleOptions<T extends PrismaClientType> {
  instance: T;
  debug?: boolean;
  customService?: Type<PrismaService<T>>;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<PrismaModuleOptions<PrismaClientType>>()
    .setClassMethodName('forRoot')
    .build();
