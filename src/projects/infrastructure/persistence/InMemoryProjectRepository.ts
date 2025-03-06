import { ProjectRepository } from "src/projects/domain/ProjectRepository";
import { Project } from "src/projects/domain/Project";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { ProjectEntity } from "./dynamo/ProjectEntity";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export class InMemoryProjectRepository implements ProjectRepository {
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

  async save(project: Project): Promise<void> {
    const entity = new ProjectEntity(
      project.id.value,
      project.name,
      project.description,
      project.image,
      project.investmentAmount,
      project.rating,
      project.userId,
      project.createdAt,
      project.updatedAt
    );

    await this.client.send(
      new PutItemCommand({
        TableName: this.table,
        Item: marshall(entity.toPrimitives()),
      })
    );
  }

  async findById(id: string): Promise<Project | null> {
    const record = (
      await this.client.send(
        new GetItemCommand({
          TableName: this.table,
          Key: {
            pk: { S: id },
            sk: { S: "PROJECT" },
          },
        })
      )
    ).Item;

    if (record === undefined) return null;

    const projectEntity = unmarshall(record) as ProjectEntity;

    return Project.fromPrimitives({
      id: projectEntity.pk,
      name: projectEntity.name,
      description: projectEntity.description,
      image: projectEntity.image,
      investmentAmount: projectEntity.investmentAmount,
      rating: projectEntity.rating,
      userId: projectEntity.userId,
      createdAt: projectEntity.createdAt,
      updatedAt: projectEntity.updatedAt,
    });
  }

  async findByName(name: string): Promise<Project | null> {
    const records = (
      await this.client.send(
        new QueryCommand({
          TableName: this.table,
          IndexName: "GSI2",
          ExpressionAttributeNames: {
            "#pk": "sk",
            "#sk": "gsi2-sk",
          },
          KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
          ExpressionAttributeValues: {
            ":pk": { S: "PROJECT" },
            ":sk": { S: name },
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

    const projectEntities = records.map(
      (item) => unmarshall(item) as ProjectEntity
    );

    const project = Project.fromPrimitives({
      id: projectEntities[0].pk,
      name: projectEntities[0].name,
      description: projectEntities[0].description,
      image: projectEntities[0].image,
      investmentAmount: projectEntities[0].investmentAmount,
      rating: projectEntities[0].rating,
      userId: projectEntities[0].userId,
      createdAt: projectEntities[0].createdAt,
      updatedAt: projectEntities[0].updatedAt,
    });

    return project;
  }

  async findByUserId(userId: string): Promise<Project[]> {
    const records = (
      await this.client.send(
        new QueryCommand({
          TableName: this.table,
          IndexName: "GSI3",
          ExpressionAttributeNames: {
            "#pk": "sk",
            "#sk": "gsi3-sk",
          },
          KeyConditionExpression: "#pk = :pk AND #sk = :sk",
          ExpressionAttributeValues: {
            ":pk": { S: "PROJECT" },
            ":sk": { S: userId },
          },
        })
      )
    ).Items;

    if (
      records === undefined ||
      records.length === 0 ||
      records[0] === undefined
    )
      return [];

    const projectEntities = records.map(
      (item) => unmarshall(item) as ProjectEntity
    );

    return projectEntities.map((entity) =>
      Project.fromPrimitives({
        id: entity.pk,
        name: entity.name,
        description: entity.description,
        image: entity.image,
        investmentAmount: entity.investmentAmount,
        rating: entity.rating,
        userId: entity.userId,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      })
    );
  }

  async findAll(
    limit: number,
    lastEvaluatedKey?: Record<string, any>
  ): Promise<{ projects: Project[]; lastEvaluatedKey?: Record<string, any> }> {
    const records = await this.client.send(
      new QueryCommand({
        TableName: this.table,
        IndexName: "GSI4",
        ExpressionAttributeNames: {
          "#pk": "sk",
        },
        KeyConditionExpression: "#pk = :pk",
        ExpressionAttributeValues: {
          ":pk": { S: "PROJECT" },
        },
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey || undefined,
      })
    );

    const items = records.Items
      ? records.Items.map((item) => unmarshall(item) as ProjectEntity)
      : [];

    if (!items.length) {
      return { projects: [], lastEvaluatedKey: undefined };
    }

    const projects = items.map((item) =>
      Project.fromPrimitives({
        id: item.pk,
        name: item.name,
        description: item.description,
        image: item.image,
        investmentAmount: item.investmentAmount,
        rating: item.rating,
        userId: item.userId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })
    );

    return { projects, lastEvaluatedKey: records.LastEvaluatedKey };
  }
}
