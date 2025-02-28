import { UserRepository } from "../UserRepository";

export class UserExistByEmail {
  constructor(private readonly userRepository: UserRepository) {}

  async run(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);

    return user !== null;
  }
}
