import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { User, UserType } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { UserEntity } from "./persistence/dynamo/UserEntity";

export class InMemoryUserRepository implements UserRepository {
  client: DynamoDBClient;
  table: string;

  constructor() {
    this.table = "emprende-mas";
    this.client = new DynamoDBClient({
      region: "custom-region",
      credentials: {
        accessKeyId: "accessKeyId123123",
        secretAccessKey: "secretAccessKey123123",
        accountId: "accountId123123",
      },
      endpoint: "http://localhost:8000",
    });
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

    await this.client.send(
      new PutItemCommand({
        TableName: this.table,
        Item: marshall(entity.toPrimitives()),
      })
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const records = (
      await this.client.send(
        new QueryCommand({
          TableName: this.table,
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
        })
      )
    ).Items;

    if (
      records === undefined ||
      records.length === 0 ||
      records[0] === undefined
    )
      return null;

    const userEntities = records.map((item) => unmarshall(item) as UserEntity);

    const user = User.fromPrimitives({
      id: userEntities[0].pk,
      name: userEntities[0].name,
      email: userEntities[0].email,
      type: userEntities[0].type as UserType,
      phone: userEntities[0].phone,
      password: userEntities[0].password,
      profilePhoto: userEntities[0].profilePhoto,
      createdAt: userEntities[0].createdAt,
      updatedAt: userEntities[0].updatedAt,
    });

    return user;
  }

  async findAll(
    limit: number,
    lastEvaluatedKey?: Record<string, any>
  ): Promise<{
    users: User[];
    lastEvaluatedKey?: Record<string, any>;
  }> {
    return {
      users: [],
      lastEvaluatedKey: undefined,
    };
  }

  async findById(id: string): Promise<User | null> {
    const record = (
      await this.client.send(
        new GetItemCommand({
          TableName: this.table,
          Key: {
            pk: { S: id },
            sk: { S: "USER" },
          },
        })
      )
    ).Item;

    if (record === undefined) return null;

    const userEntity = unmarshall(record) as UserEntity;

    return User.fromPrimitives({
      id: userEntity.pk,
      name: userEntity.name,
      email: userEntity.email,
      type: userEntity.type as UserType,
      phone: userEntity.phone,
      password: userEntity.password,
      profilePhoto: userEntity.profilePhoto,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    });
  }
}
