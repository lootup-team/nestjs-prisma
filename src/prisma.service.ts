import { Logger } from '@nestjs/common';
import { PrismaModuleOptions } from './prisma.options';
import { PrismaClientType } from './prisma.interfaces';

/**
 * Base abstract class for services that work with Prisma Client.
 *
 * This class provides general functionality for working with Prisma Client,
 * including logging and access to the Prisma Client instance.
 * It is intended to be extended by specific services that will perform specific
 * database operations.
 *
 * @template T Type Prisma Client (default PrismaClientType). Must inherit from PrismaClient.
 */
export abstract class PrismaService<T extends PrismaClientType> {
  protected readonly logger = new Logger(PrismaService.name);

  /**
   * Prisma module options.
   *
   * Contains configuration for Prisma Client, such as the Prisma Client instance, debug mode, and other settings.
   */
  constructor(protected readonly options: PrismaModuleOptions<T>) {
    this.options = options;
  }

  /**
   * Returns an instance of Prisma Client.
   *
   * Allows access to Prisma Client to perform database operations.
   *
   * @returns {T} Prisma Client instance.
   */
  public getClient(): T {
    return this.options.instance;
  }
}
