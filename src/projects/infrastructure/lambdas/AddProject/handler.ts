import { APIGatewayProxyEventV2 } from "aws-lambda";
import { AddProject } from "src/projects/application/AddProject";
import { InMemoryProjectRepository } from "../../persistence/InMemoryProjectRepository";
import { DynamoProjectRepository } from "../../persistence/dynamo/DynamoProjectRepository";
import { InMemoryUserRepository } from "src/user/infrastructure/InMemoryUserRepository";
import { DynamoUserRepository } from "src/user/infrastructure/persistence/dynamo/DynamoUserRepository";

type AddProjectSchema = {
  name: string;
  description: string;
  image: string;
  investmentAmount: number;
  userId: string;
};

const handler = async (event: APIGatewayProxyEventV2) => {
  try {
    const body: AddProjectSchema = JSON.parse(event.body);

    const projectRepository =
      process.env.STAGE === "dev"
        ? new InMemoryProjectRepository()
        : new DynamoProjectRepository(process.env.EMPRENDE_MAS_TABLE_NAME);

    const userRepository =
      process.env.STAGE === "dev"
        ? new InMemoryUserRepository()
        : new DynamoUserRepository(process.env.EMPRENDA_MAS_TABLE_NAME);

    const addProjectUseCase = new AddProject(projectRepository, userRepository);

    await addProjectUseCase.run({
      name: body.name,
      description: body.description,
      image: body.image,
      investmentAmount: body.investmentAmount,
      userId: body.userId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Proyecto creado exitosamente" }),
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
