import { User, UserType } from "src/user/domain/User";
import { UserRepository } from "src/user/domain/UserRepository";
import { PasswordHasher } from "../domain/services/PasswordHasher";
import { UserExistByEmail } from "src/user/domain/services/UserExistByEmail";

export class Register {
  private readonly userExistByEmail: UserExistByEmail;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {
    this.userExistByEmail = new UserExistByEmail(userRepository);
  }

  async run(params: {
    name: string;
    email: string;
    type: UserType;
    phone: string;
    password: string;
  }): Promise<void> {
    await this.checkIfUserExists(params.email);

    const hashedPassword = await this.passwordHasher.hash(params.password);

    const user = User.create({
      ...params,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
  }

  private async checkIfUserExists(email: string): Promise<void> {
    const userExists = await this.userExistByEmail.run(email);

    console.log(userExists);

    if (userExists) {
      throw new Error("User already exists");
    }
  }
}
