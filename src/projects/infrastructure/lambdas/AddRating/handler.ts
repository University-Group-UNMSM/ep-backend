import { APIGatewayProxyEventV2 } from "aws-lambda";
import { InMemoryProjectRepository } from "../../persistence/InMemoryProjectRepository";
import { DynamoProjectRepository } from "../../persistence/dynamo/DynamoProjectRepository";
import { AddRating } from "src/projects/application/AddRating";

type AddRatingSchema = {
  rating: number;
  projectId: string;
};

const handler = async (event: APIGatewayProxyEventV2) => {
  try {
    const authorizationHeader = event.headers["authorization"];

    if (!authorizationHeader) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }

    const body: AddRatingSchema = JSON.parse(event.body);

    const projectRepository =
      process.env.STAGE === "dev"
        ? new InMemoryProjectRepository()
        : new DynamoProjectRepository(process.env.EMPRENDE_MAS_TABLE_NAME);

    const addRatingUseCase = new AddRating(projectRepository);

    await addRatingUseCase.run({
      rating: body.rating,
      projectId: body.projectId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Rating added successfully" }),
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
