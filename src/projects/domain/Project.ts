import { ProjectId } from "./ProjectId";

export class Project {
  id: ProjectId;
  name: string;
  description: string;
  image: string;
  investmentAmount: number;
  rating: number;
  userId: string;
  createdAt: string;
  updatedAt: string;

  constructor(
    id: ProjectId,
    name: string,
    description: string,
    image: string,
    investmentAmount: number,
    rating: number,
    userId: string,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.investmentAmount = investmentAmount;
    this.rating = rating;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(params: {
    name: string;
    description: string;
    image: string;
    investmentAmount: number;
    userId: string;
  }): Project {
    return new Project(
      ProjectId.random(),
      params.name,
      params.description,
      params.image,
      params.investmentAmount,
      0,
      params.userId
    );
  }

  addRating(rating: number): void {
    this.rating = rating;
  }

  static fromPrimitives(params: {
    id: string;
    name: string;
    description: string;
    image: string;
    investmentAmount: number;
    rating: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }): Project {
    return new Project(
      new ProjectId(params.id),
      params.name,
      params.description,
      params.image,
      params.investmentAmount,
      params.rating,
      params.userId,
      params.createdAt,
      params.updatedAt
    );
  }

  toPrimitives() {
    return {
      id: this.id.value,
      name: this.name,
      description: this.description,
      image: this.image,
      investmentAmount: this.investmentAmount,
      rating: this.rating,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
