import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: "${opt:stage, self:provider.stage}-${self:service}-add-rating",
  disableLogs: true,
  role: {
    "Fn::ImportValue":
      "${opt:stage, self:provider.stage}-${self:service}-role-lambda-function-add-rating-arn",
  },
  events: [
    {
      httpApi: {
        method: "post",
        path: "/projects/rating",
      },
    },
  ],
} satisfies AWS["functions"][0];
