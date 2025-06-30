import { Module, Global, Provider } from '@nestjs/common';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  PrismaModuleOptions,
} from './prisma.options';
import { PrismaService } from './prisma.service';
import { PrismaClientType } from './prisma.interfaces';
import { PrismaServiceFactory } from './prisma.factory';

const prismaServiceProvider: Provider = {
  provide: PrismaService,
  useFactory: (options: PrismaModuleOptions<PrismaClientType>) => {
    return PrismaServiceFactory<PrismaClientType>(options);
  },
  inject: [MODULE_OPTIONS_TOKEN],
};

@Global()
@Module({
  providers: [prismaServiceProvider],
  exports: [PrismaService],
})
export class PrismaModule extends ConfigurableModuleClass {}
