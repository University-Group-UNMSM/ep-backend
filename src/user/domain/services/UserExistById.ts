import { UserRepository } from "../UserRepository";

export class UserExistById {
  constructor(private readonly userRepository: UserRepository) {}

  async run(params: { id: string }): Promise<boolean> {
    const user = await this.userRepository.findById(params.id);
    return user !== null;
  }
}
