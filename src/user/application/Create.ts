import { User, UserType } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class Create {
  constructor(private readonly userRepository: UserRepository) {}

  async run(params: {
    name: string;
    email: string;
    type: UserType;
    phone: string;
    password: string;
  }): Promise<void> {
    const user = User.create(params);
    await this.userRepository.save(user);
  }
}
