declare module 'dotenv/config';

declare module 'prisma/config' {
  export function defineConfig(arg: any): any;
  export function env(name: string): string;
  const _default: any;
  export default _default;
}

declare module '@prisma/client/runtime/library' {
  const whatever: any;
  export default whatever;
}
