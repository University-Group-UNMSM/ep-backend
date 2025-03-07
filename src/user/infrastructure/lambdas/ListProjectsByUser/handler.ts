import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ListProjectsByUser } from "src/user/application/ListProjectsByUser";
import { InMemoryUserRepository } from "../../InMemoryUserRepository";
import { DynamoUserRepository } from "../../persistence/dynamo/DynamoUserRepository";
import { InMemoryProjectRepository } from "src/projects/infrastructure/persistence/InMemoryProjectRepository";
import { DynamoProjectRepository } from "src/projects/infrastructure/persistence/dynamo/DynamoProjectRepository";

type ListProjectsByUserEvent = APIGatewayProxyEventV2 & {
  queryStringParameters: {
    limit: string;
    lastEvaluatedKey: Record<string, any>;
  };
  pathParameters: {
    userId: string;
  };
};

const handler = async (event: ListProjectsByUserEvent) => {
  try {
    const authorizationHeader = event.headers["authorization"];
    if (!authorizationHeader) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }

    const userRepository =
      process.env.STAGE === "dev"
        ? new InMemoryUserRepository()
        : new DynamoUserRepository(process.env.EMPRENDE_MAS_TABLE_NAME);

    const projectRepository =
      process.env.STAGE === "dev"
        ? new InMemoryProjectRepository()
        : new DynamoProjectRepository(process.env.EMPRENDE_MAS_TABLE_NAME);

    const listMyProjects = new ListProjectsByUser(
      projectRepository,
      userRepository
    );

    const limit = Number(event.queryStringParameters?.limit) || 10;

    console.log(limit);

    const projects = await listMyProjects.run({
      userId: event.pathParameters.userId,
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
    console.error("Error listing projects by user", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

export const main = handler;
