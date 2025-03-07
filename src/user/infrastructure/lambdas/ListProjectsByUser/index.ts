import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: "${opt:stage, self:provider.stage}-${self:service}-list-projects-by-user",
  disableLogs: true,
  role: {
    "Fn::ImportValue":
      "${opt:stage, self:provider.stage}-${self:service}-role-lambda-function-list-projects-by-user-arn",
  },
  events: [
    {
      httpApi: {
        method: "get",
        path: "/user/{userId}/projects",
      },
    },
  ],
} satisfies AWS["functions"][0];
