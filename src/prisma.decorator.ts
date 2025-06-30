import { Inject } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Decorator for injecting a PrismaService instance.
 *
 * This decorator serves as a shorthand for `@Inject(PrismaService)`.
 * It makes it easier to inject a Prisma service into components (e.g. controllers, services),
 * making the code more readable and less prone to typos.
 *
 * @example
 * ```typescript
 * import { Injectable } from '@nestjs/common';
 * import { InjectPrisma, PrismaService } from '@lootupteam/nestjs-prisma';
 * import { PrismaClient } from '@generated/prisma/client'; // Your path to generated Prisma
 *
 * @Injectable()
 * class MyService {
 *   constructor(
 *     @InjectPrisma() private readonly prismaService: PrismaService<PrismaClient>
 *     // or if you want to inject your custom service
 *     @InjectPrisma() private readonly prismaService: CustomPrismaService
 *   ) {}
 *
 *   async doSomething() {
 *     // Use prismaService here
 *   }
 * }
 * ```
 * @returns {MethodDecorator & ClassDecorator} Decorator that can be used for PrismaService inject.
 */
export const InjectPrisma = () => Inject(PrismaService);
