import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: "${opt:stage, self:provider.stage}-${self:service}-get-my-profile",
  disableLogs: true,
  role: {
    "Fn::ImportValue":
      "${opt:stage, self:provider.stage}-${self:service}-role-lambda-function-get-my-profile-arn",
  },
  events: [
    {
      httpApi: {
        method: "get",
        path: "/auth/profile",
      },
    },
  ],
} satisfies AWS["functions"][0];
