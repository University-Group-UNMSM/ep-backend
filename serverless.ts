import type { AWS } from "@serverless/typescript";
import { config } from "dotenv";
import { addProject, login, register } from "@functions/index";

config();

const serverlessConfiguration: AWS = {
  service: "emprende-mas",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    stage: "${opt:stage, 'dev'}",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      EMPRENDE_MAS_TABLE_NAME:
        "${opt:stage, self:provider.stage}-${self:service}-table",
      STAGE: "${self:provider.stage}",
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_TIME_EXPIRATION: process.env.JWT_TIME_EXPIRATION,
    },
    httpApi: {
      id: {
        "Fn::ImportValue":
          "${opt:stage, self:provider.stage}-${self:service}-http-api-id",
      },
    },
  },
  // import the function via paths
  functions: { register, login, addProject },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    "serverless-offline": {
      prefix: "api",
    },
  },
};

module.exports = serverlessConfiguration;
