declare module 'dotenv';
declare module 'drizzle-orm/node-postgres';
declare module 'drizzle-orm/pg-core';
declare module 'drizzle-zod';
declare module 'zod/v4';
declare module 'zod';
declare module 'pg';
declare module 'path';
declare module 'url';

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string;
    [key: string]: string | undefined;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};

declare const __dirname: string;

export {};
