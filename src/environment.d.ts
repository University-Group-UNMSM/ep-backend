type InfrastructureEnvironmentVariables = {
  STAGE: "dev" | "testing" | "production";
  SALT_ROUNDS: number;
  EMPRENDE_MAS_TABLE_NAME: string;
  JWT_SECRET: string;
  JWT_TIME_EXPIRATION: string;
};

declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Process {
    env: InfrastructureEnvironmentVariables;
  }
}
