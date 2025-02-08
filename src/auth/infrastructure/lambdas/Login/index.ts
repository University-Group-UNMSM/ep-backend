import type { AWS } from "@serverless/typescript";
import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: "${opt:stage, self:provider.stage}-${self:service}-login",
  disableLogs: true,
  role: {
    "Fn::ImportValue":
      "${opt:stage, self:provider.stage}-${self:service}-role-lambda-function-login-arn",
  },
  events: [
    {
      http: {
        method: "post",
        path: "/auth/login",
      },
    },
    {
      http: {
        method: "options",
        path: "/auth/login",
      },
    },
  ],
} satisfies AWS["functions"][0];
