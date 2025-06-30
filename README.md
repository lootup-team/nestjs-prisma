# NestJs Prisma

[![npm version](https://badge.fury.io/js/@lootupteam-nestjs-prisma.svg)](https://badge.fury.io/js/%40lootupteam%2Fnestjs-prisma)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Overview

`@lootupteam/nestjs-prisma` - is a library designed to simplify the integration of Prisma ORM into NestJS applications. It provides base classes, utilities, and extensions to make working with Prisma more convenient and type-safe.

## Features

- **Prisma Service:** The base abstract class `PrismaService` for working with Prisma Client. Provides logging and access to Prisma Client.
- **Prisma Module:** NestJS module for registering and configuring Prisma. Supports asynchronous configuration.
- **Dependency Injection:** Convenient decorators and methods for injecting `PrismaService` into application components.
- **Custom Adapters:** The ability to use the implementation principles of PrismaService to extend functionality.

## Installation

```bash
npm install @lootupteam/nestjs-prisma @prisma/client prisma
# or
pnpm add @lootupteam/nestjs-prisma @prisma/client prisma
# or
yarn add @lootupteam/nestjs-prisma @prisma/client prisma
```

## Getting Started

- **Import and Configure `PrismaModule`:** In your `AppModule` (or any other module), import and configure `PrismaModule`:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@lootupteam/nestjs-prisma';
import { PrismaClient } from '@generated/prisma/client'; // Your path to generated Prisma
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaModule.forRootAsync({
      // Use forRootAsync for better configuration
      useFactory: () => ({
        instance: new PrismaClient({
          // Configure PrismaClient
          log: [{ level: 'query', emit: 'event' }], // Enable query logging
        }),
        debug: true, // Enable debug mode
      }),
    }),
  ],
  providers: [AppService],
  controllers: [],
})
export class AppModule {}
```

- **Inject `PrismaService`**: Inject `PrismaService` (or your extended service) into your services or controllers:

```typescript
// src/app.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@generated/prisma/client'; // Your path to generated Prisma
import { InjectPrisma, PrismaService } from '@lootupteam/nestjs-prisma'; // Import InjectPrisma decorator and PrismaService
// import { ExtendedPrismaService } from './extended-prisma.service';  // If you have custom service

@Injectable()
export class AppService {
  constructor(
    @InjectPrisma() private readonly prismaService: PrismaService<PrismaClient>, // Inject PrismaService using decorator
    // @InjectPrisma() private readonly prismaService: ExtendedPrismaService, // Inject custom service
  ) {}

  async getUsers() {
    return this.prismaService.getClient().user.findMany();
  }

  // Use prismaService.getClient() to access PrismaClient directly
  async createUser(email: string, name: string) {
    return this.prismaService
      .getClient()
      .user.create({ data: { email, name } });
  }
}
```

## Advanced Usage

### Using Custom Prisma Services

- **Create a Custom Service (e.g., `ExtendedPrismaService`):** Create a class that extends `PrismaService`:

```typescript
// src/extended-prisma.service.ts
import { Injectable, Logger } from '@nestjs/common';
import {
  PrismaService,
  PrismaModuleOptions,
  MODULE_OPTIONS_TOKEN,
} from '@lootupteam/nestjs-prisma';
import { PrismaClient } from '@generated/prisma/client'; // Your path to generated Prisma
import { Inject } from '@nestjs/common';

@Injectable()
export class ExtendedPrismaService extends PrismaService<PrismaClient> {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    protected readonly options: PrismaModuleOptions<PrismaClient>,
  ) {
    super(options);
  }

  async getTemplatesByOwner(ownerId: string) {
    const prisma = this.getClient();
    return prisma.template.findMany({ where: { ownerId } });
  }
}
```

- **Register the Custom Service:** Register a custom service in `PrismaModule` using `forRootAsync`:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@lootupteam/nestjs-prisma';
import { PrismaClient } from '@generated/prisma/client'; // Your path to generated Prisma
import { AppService } from './app.service';
import { ExtendedPrismaService } from './extended-prisma.service';

@Module({
  imports: [
    PrismaModule.forRootAsync({
      useFactory: () => ({
        instance: new PrismaClient({
          log: [{ level: 'query', emit: 'event' }],
        }),
        debug: true,
        customService: ExtendedPrismaService, // use ExtendedPrismaService
      }),
    }),
  ],
  providers: [AppService],
  controllers: [],
})
export class AppModule {}
```

- **Inject the Custom Service:** Inject the custom service into your component:

```typescript
// src/app.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { PrismaService, InjectPrisma } from '@lootupteam/nestjs-prisma';
import { ExtendedPrismaService } from './extended-prisma.service';

@Injectable()
export class AppService {
  constructor(
    @InjectPrisma() private readonly prismaService: ExtendedPrismaService, // Inject ExtendedPrismaService
  ) {}

  async getUsers() {
    return this.prismaService.getClient().user.findMany();
  }
}
```

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/lootup-team/nestjs-prisma/blob/main/LICENSE) file for details.

## Support

For any questions or issues, please open an issue in this repository.
