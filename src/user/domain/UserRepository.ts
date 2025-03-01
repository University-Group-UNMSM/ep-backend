import { User } from "./User";

export interface UserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findAll(
    limit: number,
    lastEvaluatedKey?: Record<string, any>
  ): Promise<{
    users: User[];
    lastEvaluatedKey?: Record<string, any>;
  }>;
  findById(id: string): Promise<User | null>;
}
