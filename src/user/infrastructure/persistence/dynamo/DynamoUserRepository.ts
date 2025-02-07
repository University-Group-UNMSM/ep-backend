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
      user.createdAt,
      user.updatedAt
    );

    await this.client.save(entity);
  }

  async findAll(): Promise<User[]> {
    const entities = await this.client.query({
      ExpressionAttributeNames: {
        "#pk": "sk",
      },
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeValues: {
        ":pk": { S: "USER" },
      },
    });

    if (!entities.length) return [];

    return entities.map((entity) =>
      User.fromPrimitives({
        id: entity.pk,
        name: entity.name,
        email: entity.email,
        type: entity.type as UserType,
        phone: entity.phone,
        password: entity.password,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      })
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.client.query({
      IndexName: 'GSI1',
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": { S: email },
      },
    })

    if (!entity.length) return null;

    const user = User.fromPrimitives({
      id: entity[0].pk,
      name: entity[0].name,
      email: entity[0].email,
      type: entity[0].type as UserType,
      phone: entity[0].phone,
      password: entity[0].password,
      createdAt: entity[0].createdAt,
      updatedAt: entity[0].updatedAt,
    })

    return user;
  }
}
