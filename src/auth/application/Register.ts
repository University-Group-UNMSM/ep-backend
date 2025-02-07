import { User, UserType } from "src/user/domain/User";
import { UserRepository } from "src/user/domain/UserRepository";

export class Register {
  constructor(private readonly userRepository: UserRepository) {}

  async run(params: {
    name: string;
    email: string;
    type: UserType;
    phone: string;
    password: string;
  }): Promise<void> {
    const user = User.create(params);
    console.log(params);

    await this.userRepository.save(user);
  }
}
