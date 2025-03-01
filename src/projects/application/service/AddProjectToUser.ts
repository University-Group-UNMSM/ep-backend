import { Project } from "src/projects/domain/Project";
import { ProjectRepository } from "src/projects/domain/ProjectRepository";
import { UserRepository } from "src/user/domain/UserRepository";
import { UserExistById } from "src/user/domain/services/UserExistById";

export class AddProjectToUser {
  private readonly userExistById: UserExistById;

  constructor(
    private readonly projectRepository: ProjectRepository,
    userRepository: UserRepository
  ) {
    this.userExistById = new UserExistById(userRepository);
  }

  async run(params: {
    name: string;
    description: string;
    image: string;
    investmentAmount: number;
    userId: string;
  }): Promise<void> {
    await this.checkIfUserExists(params.userId);
    const project = Project.create(params);
    await this.projectRepository.save(project);
  }

  private async checkIfUserExists(userId: string): Promise<void> {
    const userExists = await this.userExistById.run({ id: userId });
    if (!userExists) {
      throw new Error("User not found");
    }
  }
}
