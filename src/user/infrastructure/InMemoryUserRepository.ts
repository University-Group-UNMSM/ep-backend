import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class InMemoryUserRepository implements UserRepository {
  private readonly users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);

    console.log("User saved", user);
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }
}
