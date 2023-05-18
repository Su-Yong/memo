declare namespace NodeJS {
  interface Process {
    env: {
      SERVER_PORT: string | undefined;
      SERVER_HOST: string | undefined;
    }
  }
}