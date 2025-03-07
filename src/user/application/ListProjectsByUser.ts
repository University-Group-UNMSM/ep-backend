import { UserRepository } from "../domain/UserRepository";
import { ProjectRepository } from "src/projects/domain/ProjectRepository";
import { GetProjectsByUserId } from "./services/GetProjectsByUserId";

export class ListProjectsByUser {
  private readonly getProjectsByUserId: GetProjectsByUserId;

  constructor(
    projectRepository: ProjectRepository,
    userRepository: UserRepository
  ) {
    this.getProjectsByUserId = new GetProjectsByUserId(
      projectRepository,
      userRepository
    );
  }

  async run(params: {
    userId: string;
    limit: number;
    lastEvaluatedKey?: Record<string, any>;
  }) {
    const result = await this.getProjectsByUserId.run(params);

    return result;
  }
}
