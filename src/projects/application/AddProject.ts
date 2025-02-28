import { ProjectRepository } from "../domain/ProjectRepository";
import { Project } from "../domain/Project";

export class AddProject {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async run(params: {
    name: string;
    description: string;
    image: string;
    investmentAmount: number;
    userId: string;
  }): Promise<void> {
    const project = Project.create(params);
    await this.projectRepository.save(project);
  }
}
