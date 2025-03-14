import { InMemoryUserRepository } from "src/user/infrastructure/InMemoryUserRepository";

import { Register } from "src/auth/application/Register";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserType } from "src/user/domain/User";
import { DynamoUserRepository } from "src/user/infrastructure/persistence/dynamo/DynamoUserRepository";
import { formatPreflightResponse } from "@libs/format-preflight-response";
import { BcryptPasswordHasher } from "../../security/BcryptPasswordHasher";

type RegisterUserSchema = {
  name: string;
  email: string;
  type: UserType;
  phone: string;
  password: string;
};

const handler = async (event: APIGatewayProxyEventV2) => {
  if (event.requestContext.http.method === "OPTIONS") {
    return formatPreflightResponse();
  }

  try {
    const body: RegisterUserSchema = JSON.parse(event.body);

    const userRepository =
      process.env.STAGE === "dev"
        ? new InMemoryUserRepository()
        : new DynamoUserRepository(process.env.EMPRENDE_MAS_TABLE_NAME);

    const passwordHasher = new BcryptPasswordHasher();

    const registerUserUseCase = new Register(userRepository, passwordHasher);

    await registerUserUseCase.run({
      name: body.name,
      email: body.email,
      type: body.type,
      phone: body.phone,
      password: body.password,
    });

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User registered" }),
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
