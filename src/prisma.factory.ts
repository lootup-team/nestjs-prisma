import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClientType } from './prisma.interfaces';
import { MODULE_OPTIONS_TOKEN, PrismaModuleOptions } from './prisma.options';
import { PrismaService } from './prisma.service';

/**
 * @internal
 * Internal implementation of PrismaService that manages the connection and disconnection of Prisma Client.
 *
 * This class is not intended for direct use outside of PrismaModule.
 * It extends `PrismaService` and implements the `OnModuleInit` and `OnModuleDestroy` interfaces,
 * to ensure that Prisma is connected to when the module is initialized and disconnected when it is terminated.
 * It also handles 'error' and 'query' events for logging.
 *
 * @template T Type Prisma Client (default PrismaClientType).
 *
 * @remarks
 * This class is part of the internal implementation of the Prisma module and should not be used directly in client code.
 */
@Injectable()
class PrismaServiceHost<T extends PrismaClientType>
  extends PrismaService<T>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    protected readonly options: PrismaModuleOptions<T>,
  ) {
    super(options);
  }

  /**
   * Called when the module is initialized.
   *
   * Connects to Prisma Client and sets up 'error' and 'query' event handlers.
   *
   * @returns {Promise<void>}
   */
  public async onModuleInit(): Promise<void> {
    await this.options.instance.$connect();

    this.options.instance.$on('error', (e) => {
      this.logger.fatal(`Prisma error: ${e.message}`, e);
    });

    if (this.options.debug) {
      this.options.instance.$on('query', (e) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Parameters: ${e.params}`);
        this.logger.debug(`Duration: ${e.duration} ms`);
      });
    }
  }

  /**
   * Called when the module completes.
   *
   * Disconnects from Prisma Client.
   *
   * @returns {Promise<void>}
   */
  public async onModuleDestroy(): Promise<void> {
    await this.options.instance.$disconnect();
  }
}

/**
 * Factory for creating a PrismaService instance.
 *
 * Determines which PrismaService instance will be created - either a custom service passed via options,
 * or `PrismaServiceHost`.
 *
 * @template T Type Prisma Client (default PrismaClientType).
 * @param {PrismaModuleOptions<T>} options Module options Prisma.
 * @returns {PrismaService<T>} PrismaService instance.
 */
export const PrismaServiceFactory = <T extends PrismaClientType>(
  options: PrismaModuleOptions<T>,
): PrismaService<T> => {
  if (options.customService) {
    return new options.customService(options);
  }
  return new PrismaServiceHost<T>(options);
};
