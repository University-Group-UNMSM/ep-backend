import { User } from "./User";

export interface UserRepository {
  save(user: User): Promise<void>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>
}
