type QueryEvent = {
  timestamp: Date;
  query: string; // Query sent to the database
  params: string; // Query parameters
  duration: number; // Time elapsed (in milliseconds) between client issuing query and database responding - not only time taken to run query
  target: string;
};

type LogEvent = {
  timestamp: Date;
  message: string;
  target: string;
};

type EventType = 'query' | 'warn' | 'error' | 'info';

/**
 * A type representing the minimal interface of the Prisma Client.
 *
 * Defines the basic methods needed to work with the Prisma Client:
 * connecting, disconnecting, and handling events.
 *
 * @remarks
 * This type is used to type the Prisma Client in other parts of the
 * codebase. It simplifies working with the Prisma Client by
 * providing basic types.
 */
export type PrismaClientType = {
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
  $on: <T extends EventType>(
    eventType: T,
    callback: (event: T extends 'query' ? QueryEvent : LogEvent) => void,
  ) => PrismaClientType;
};
