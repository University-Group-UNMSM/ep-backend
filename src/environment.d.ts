type InfrastructureEnvironmentVariables = {
  STAGE: "dev" | "testing" | "production";
  JWT_SECRET: string;
  JWT_TIME_EXPIRATION: string;
  SALT_ROUNDS: number;
  EMPRENDA_MAS_TABLE_NAME: string;
};

declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Process {
    env: InfrastructureEnvironmentVariables;
  }
}
