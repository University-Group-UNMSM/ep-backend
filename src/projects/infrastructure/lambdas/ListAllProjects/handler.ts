import { APIGatewayProxyEventV2 } from "aws-lambda";
import { InMemoryProjectRepository } from "../../persistence/InMemoryProjectRepository";
import { DynamoProjectRepository } from "../../persistence/dynamo/DynamoProjectRepository";
import { ListAllProjects } from "src/projects/application/ListAllProjects";

type ListAllProjectsCustomEvent = APIGatewayProxyEventV2 & {
  queryStringParameters: {
    limit: number;
    lastEvaluatedKey?: Record<string, any>;
  };
};

const handler = async (event: ListAllProjectsCustomEvent) => {
  try {
    const authorizationHeader = event.headers["authorization"];

    if (!authorizationHeader) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }

    const projectRepository =
      process.env.STAGE === "dev"
        ? new InMemoryProjectRepository()
        : new DynamoProjectRepository(process.env.EMPRENDE_MAS_TABLE_NAME);

    const listAllProjectsUseCase = new ListAllProjects(projectRepository);

    const limit = Number(event.queryStringParameters?.limit) || 10;

    const projects = await listAllProjectsUseCase.run({
      limit,
      lastEvaluatedKey: event.queryStringParameters?.lastEvaluatedKey,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        metadata: {
          lastEvaluatedKey: projects.lastEvaluatedKey,
          total: projects.projects.length,
          limit,
        },
        data: projects.projects.map((project) => project.toPrimitives()),
      }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

export const main = handler;
