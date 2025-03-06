import { APIGatewayProxyEventV2 } from "aws-lambda";
import { GetMyProfile } from "src/auth/application/GetMyProfile";
import { InMemoryUserRepository } from "src/user/infrastructure/InMemoryUserRepository";
import { DynamoUserRepository } from "src/user/infrastructure/persistence/dynamo/DynamoUserRepository";
import { JsonwebtokenJwtEncoder } from "../../security/JsonwebtokenJwtEncoder";

const handler = async (event: APIGatewayProxyEventV2) => {
  try {
    const authorizationHeader = event.headers["authorization"];

    if (!authorizationHeader) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }

    const token = authorizationHeader.split(" ")[1];

    const userRepository =
      process.env.STAGE === "dev"
        ? new InMemoryUserRepository()
        : new DynamoUserRepository(process.env.EMPRENDE_MAS_TABLE_NAME);

    const jwtEncoder = new JsonwebtokenJwtEncoder(
      process.env.JWT_SECRET,
      process.env.JWT_TIME_EXPIRATION
    );

    const getMyProfileUseCase = new GetMyProfile(userRepository, jwtEncoder);

    const profile = await getMyProfileUseCase.run({ token });

    return {
      statusCode: 200,
      body: JSON.stringify(profile),
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
