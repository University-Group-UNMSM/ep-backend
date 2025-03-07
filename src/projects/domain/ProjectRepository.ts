import { Project } from "./Project";

export interface ProjectRepository {
  save(project: Project): Promise<void>;
  findById(id: string): Promise<Project | null>;
  findByName(name: string): Promise<Project | null>;
  findByUserId(
    userId: string,
    limit: number,
    lastEvaluatedKey?: Record<string, any>
  ): Promise<{
    projects: Project[];
    lastEvaluatedKey?: Record<string, any>;
  }>;
  findAll(
    limit: number,
    lastEvaluatedKey?: Record<string, any>
  ): Promise<{
    projects: Project[];
    lastEvaluatedKey?: Record<string, any>;
  }>;
}
