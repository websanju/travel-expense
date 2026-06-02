declare module "dotenv/config";

declare module "prisma/config" {
  export function defineConfig<T>(arg: T): T;

  export function env(
    name: string
  ): string;

  const config: unknown;

  export default config;
}

declare module "@prisma/client/runtime/library" {
  const runtimeLibrary: unknown;

  export default runtimeLibrary;
}