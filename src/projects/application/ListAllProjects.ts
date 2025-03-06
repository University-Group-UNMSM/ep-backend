import { ProjectRepository } from "../domain/ProjectRepository";

export class ListAllProjects {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async run(params: { limit: number; lastEvaluatedKey?: Record<string, any> }) {
    return await this.projectRepository.findAll(
      params.limit,
      params.lastEvaluatedKey
    );
  }
}
