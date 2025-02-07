import type { AWS } from "@serverless/typescript";
import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: "${opt:stage, self:provider.stage}-${self:service}-register-user",
  disableLogs: true,
  role: {
    "Fn::ImportValue":
      "${opt:stage, self:provider.stage}-${self:service}-role-lambda-function-register-user-arn",
  },
  events: [
    {
      http: {
        method: "post",
        path: "/auth/register",
      },
    },
  ],
} satisfies AWS["functions"][0];
