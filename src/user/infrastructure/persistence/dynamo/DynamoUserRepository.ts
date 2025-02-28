import { DynamoDbClient } from "src/shared/infrastructure/persistence/dynamo/DynamoClient";
import { UserRepository } from "src/user/domain/UserRepository";
import { UserEntity } from "./UserEntity";
import { User, UserType } from "src/user/domain/User";

export class DynamoUserRepository implements UserRepository {
  private readonly client: DynamoDbClient<
    UserEntity,
    { pk: string; sk: string }
  >;

  constructor(table: string) {
    this.client = new DynamoDbClient(table);
  }

  async save(user: User): Promise<void> {
    const entity = new UserEntity(
      user.id.value,
      user.name,
      user.email,
      user.type,
      user.phone,
      user.password,
      user.profilePhoto,
      user.createdAt,
      user.updatedAt
    );

    await this.client.save(entity);
  }

  async findAll(
    limit: number,
    lastEvaluatedKey?: Record<string, any>
  ): Promise<{
    users: User[];
    lastEvaluatedKey?: Record<string, any>;
  }> {
    const entities = await this.client.query({
      ExpressionAttributeNames: {
        "#pk": "sk",
      },
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeValues: {
        ":pk": { S: "USER" },
      },
    });

    if (!entities.length) return { users: [], lastEvaluatedKey: undefined };

    const users = entities.map((entity) =>
      User.fromPrimitives({
        id: entity.pk,
        name: entity.name,
        email: entity.email,
        type: entity.type as UserType,
        phone: entity.phone,
        password: entity.password,
        profilePhoto: entity.profilePhoto,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      })
    );

    return {
      users,
      lastEvaluatedKey: entities[entities.length - 1].sk
        ? { sk: entities[entities.length - 1].sk }
        : undefined,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const entities = await this.client.query({
      ExpressionAttributeNames: {
        "#pk": "sk",
        "#sk": "gsi1-sk",
      },
      IndexName: "GSI1",
      KeyConditionExpression: "#pk = :pk AND #sk = :sk",
      ExpressionAttributeValues: {
        ":pk": { S: "USER" },
        ":sk": { S: email },
      },
    });

    if (!entities.length) return null;

    return User.fromPrimitives({
      id: entities[0].pk,
      name: entities[0].name,
      email: entities[0].email,
      type: entities[0].type as any,
      phone: entities[0].phone,
      password: entities[0].password,
      profilePhoto: entities[0].profilePhoto,
      createdAt: entities[0].createdAt,
      updatedAt: entities[0].updatedAt,
    });
  }
}
