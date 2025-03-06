import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: "${opt:stage, self:provider.stage}-${self:service}-list-all-projects",
  disableLogs: true,
  role: {
    "Fn::ImportValue":
      "${opt:stage, self:provider.stage}-${self:service}-role-lambda-function-list-all-projects-arn",
  },
  events: [
    {
      httpApi: {
        method: "get",
        path: "/projects",
      },
    },
  ],
} satisfies AWS["functions"][0];
