import type { AWS } from "@serverless/typescript";

import { login, register } from "@functions/index";

const serverlessConfiguration: AWS = {
  service: "emprende-mas",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    stage: "${opt:stage, 'dev'}",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      USER_TABLE_NAME:
        "${opt:stage, self:provider.stage}-${self:service}-user-table",
      STAGE: "${self:provider.stage}",
    },
    httpApi: {
      id: {
        "Fn::ImportValue":
          "${opt:stage, self:provider.stage}-${self:service}-http-api-id",
      },
    },
  },
  // import the function via paths
  functions: { register, login },
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
