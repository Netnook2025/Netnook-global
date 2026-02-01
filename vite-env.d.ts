
// Use declaration merging to add API_KEY to process.env
// This avoids "Cannot redeclare block-scoped variable 'process'" error
declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
    [key: string]: string | undefined;
  }
}
