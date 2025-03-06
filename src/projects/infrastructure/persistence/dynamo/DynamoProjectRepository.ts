import { ProjectRepository } from "src/projects/domain/ProjectRepository";
import { DynamoDbClient } from "src/shared/infrastructure/persistence/dynamo/DynamoClient";
import { ProjectEntity } from "./ProjectEntity";
import { Project } from "src/projects/domain/Project";

export class DynamoProjectRepository implements ProjectRepository {
  private readonly client: DynamoDbClient<
    ProjectEntity,
    { pk: string; sk: string }
  >;

  constructor(table: string) {
    this.client = new DynamoDbClient(table);
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

    await this.client.save(entity);
  }

  async findById(id: string): Promise<Project | null> {
    const entity = await this.client.findOne({
      pk: id,
      sk: "PROJECT",
    });

    if (!entity) return null;

    return Project.fromPrimitives({
      id: entity.pk,
      name: entity.name,
      description: entity.description,
      image: entity.image,
      investmentAmount: entity.investmentAmount,
      rating: entity.rating,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  async findByName(name: string): Promise<Project | null> {
    const entities = await this.client.query({
      ExpressionAttributeNames: {
        "#pk": "sk",
        "#sk": "gsi2-sk",
      },
      KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
      ExpressionAttributeValues: {
        ":pk": { S: "PROJECT" },
        ":sk": { S: name },
      },
    });

    if (!entities.length) return null;

    return Project.fromPrimitives({
      id: entities[0].pk,
      name: entities[0].name,
      description: entities[0].description,
      image: entities[0].image,
      investmentAmount: entities[0].investmentAmount,
      rating: entities[0].rating,
      userId: entities[0].userId,
      createdAt: entities[0].createdAt,
      updatedAt: entities[0].updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<Project[]> {
    const entities = await this.client.query({
      ExpressionAttributeNames: {
        "#pk": "sk",
        "#sk": "gsi3-sk",
      },
      KeyConditionExpression: "#pk = :pk AND #sk = :sk",
      ExpressionAttributeValues: {
        ":pk": { S: "PROJECT" },
        ":sk": { S: userId },
      },
    });

    if (!entities.length) return [];

    return entities.map((entity) =>
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
    const result = await this.client.queryWithPagination(
      {
        ExpressionAttributeNames: {
          "#pk": "sk",
        },
        IndexName: "GSI4",
        KeyConditionExpression: "#pk = :pk",
        ExpressionAttributeValues: {
          ":pk": { S: "PROJECT" },
        },
      },
      limit,
      lastEvaluatedKey
    );

    if (!result.items.length)
      return { projects: [], lastEvaluatedKey: undefined };

    const projects = result.items.map((item) =>
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

    return { projects, lastEvaluatedKey: result.lastEvaluatedKey };
  }
}
