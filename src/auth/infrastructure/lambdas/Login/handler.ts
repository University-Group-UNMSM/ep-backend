import { InMemoryUserRepository } from "src/user/infrastructure/InMemoryUserRepository";

import { Login } from "src/auth/application/Login";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { DynamoUserRepository } from "src/user/infrastructure/persistence/dynamo/DynamoUserRepository";

type LoginSchema = {
    email: string;
    password: string;
};

const handler = async (event: APIGatewayProxyEventV2) => {
    try {
        const body: LoginSchema = JSON.parse(event.body);

        const userRepository = process.env.STAGE === "dev"
            ? new InMemoryUserRepository()
            : new DynamoUserRepository(process.env.USER_TABLE_NAME);

        const loginUseCase = new Login(userRepository);

        const token = await loginUseCase.run({
            email: body.email,
            password: body.password
        })

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Inicio de Sesion Exitoso',
                token,
            })
        }
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error loging" }),
        };
    }
}

export const main = handler;