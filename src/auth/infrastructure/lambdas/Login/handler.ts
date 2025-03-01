import { InMemoryUserRepository } from "src/user/infrastructure/InMemoryUserRepository";

import { Login } from "src/auth/application/Login";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { DynamoUserRepository } from "src/user/infrastructure/persistence/dynamo/DynamoUserRepository";
import { BcryptPasswordHasher } from "../../security/BcryptPasswordHasher";
import { JsonwebtokenJwtEncoder } from "../../security/JsonwebtokenJwtEncoder";

import { formatPreflightResponse } from "@libs/format-preflight-response";


type LoginSchema = {
  email: string;
  password: string;
};

const handler = async (event: APIGatewayProxyEventV2) => {
  if (event.requestContext.http.method === "OPTIONS") {
    return formatPreflightResponse();
  }

  try {
    const body: LoginSchema = JSON.parse(event.body);

    const userRepository =
      process.env.STAGE === "dev"
        ? new InMemoryUserRepository()
        : new DynamoUserRepository(process.env.EMPRENDE_MAS_TABLE_NAME);

    const passwordHasher = new BcryptPasswordHasher();
    const jwtEncoder = new JsonwebtokenJwtEncoder(
      process.env.JWT_SECRET,
      process.env.JWT_TIME_EXPIRATION
    );

    const loginUseCase = new Login(userRepository, passwordHasher, jwtEncoder);

    const token = await loginUseCase.run({
      email: body.email,
      password: body.password,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Inicio de Sesion Exitoso",
        token,
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
