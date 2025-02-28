type InfrastructureEnvironmentVariables = {
  STAGE: "dev" | "testing" | "production";
  USER_TABLE_NAME: string;
  SALT_ROUNDS: number;
};

declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Process {
    env: InfrastructureEnvironmentVariables;
  }
}
