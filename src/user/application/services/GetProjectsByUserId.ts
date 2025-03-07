import { ProjectRepository } from "src/projects/domain/ProjectRepository";
import { UserRepository } from "src/user/domain/UserRepository";

export class GetProjectsByUserId {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository
  ) {}

  async run(params: {
    userId: string;
    limit: number;
    lastEvaluatedKey?: Record<string, any>;
  }) {
    const user = await this.userRepository.findById(params.userId);

    if (!user) {
      throw new Error("User not found");
    }

    const result = await this.projectRepository.findByUserId(
      params.userId,
      params.limit,
      params.lastEvaluatedKey
    );

    return result;
  }
}
