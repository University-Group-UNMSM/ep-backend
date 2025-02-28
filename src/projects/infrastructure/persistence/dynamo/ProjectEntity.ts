import { DynamoBaseEntity } from "src/shared/infrastructure/persistence/dynamo/DynamoBaseEntity";

export class ProjectEntity extends DynamoBaseEntity {
  readonly pk: string;
  readonly sk: string;
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly investmentAmount: number;
  readonly rating: number;
  readonly userId: string;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(
    id: string,
    name: string,
    description: string,
    image: string,
    investmentAmount: number,
    rating: number,
    userId: string,
    createdAt: string,
    updatedAt: string
  ) {
    super();
    this.pk = id;
    this.sk = "PROJECT";
    this.name = name;
    this.description = description;
    this.image = image;
    this.investmentAmount = investmentAmount;
    this.rating = rating;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toPrimitives(): object {
    return {
      pk: this.pk,
      sk: this.sk,
      name: this.name,
      description: this.description,
      image: this.image,
      investmentAmount: this.investmentAmount,
      rating: this.rating,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      "gsi2-sk": this.name, // search by name
      "gsi3-sk": this.userId, // Get projects by user id
      "gsi4-sk": this.pk, // Get projects by user id
    };
  }
}
