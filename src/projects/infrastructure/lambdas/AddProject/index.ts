import { handlerPath } from "@libs/handler-resolver";
import type { AWS } from "@serverless/typescript";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: "${opt:stage, self:provider.stage}-${self:service}-add-project",
  disableLogs: true,
  role: {
    "Fn::ImportValue":
      "${opt:stage, self:provider.stage}-${self:service}-role-lambda-function-add-project-arn",
  },
  events: [
    {
      httpApi: {
        method: "post",
        path: "/projects",
      },
    },
  ],
} satisfies AWS["functions"][0];
