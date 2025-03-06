import { ProjectRepository } from "../domain/ProjectRepository";
import { UserRepository } from "src/user/domain/UserRepository";
import { AddProjectToUser } from "./service/AddProjectToUser";

export class AddProject {
  private readonly addProjectService: AddProjectToUser;

  constructor(
    projectRepository: ProjectRepository,
    userRepository: UserRepository
  ) {
    this.addProjectService = new AddProjectToUser(
      projectRepository,
      userRepository
    );
  }

  async run(params: {
    name: string;
    description: string;
    image: string;
    investmentAmount: number;
    userId: string;
  }): Promise<void> {
    await this.addProjectService.run(params);
  }
}
