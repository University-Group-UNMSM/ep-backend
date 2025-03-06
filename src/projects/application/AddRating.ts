import { ProjectRepository } from "src/projects/domain/ProjectRepository";

export class AddRating {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async run({ projectId, rating }) {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    project.addRating(rating);

    await this.projectRepository.save(project);
  }
}
