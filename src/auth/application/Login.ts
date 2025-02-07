import { User, UserType } from "src/user/domain/User";
import { UserRepository } from "src/user/domain/UserRepository";
import * as jwt from "jsonwebtoken";

export class Login {
  constructor(private userRepository: UserRepository) {}

  async run(params: { email: string; password: string }) {
    const user = await this.userRepository.findByEmail(params.email);

    if (user.password !== params.password)
      throw new Error("Invalid credentials");

    const token = jwt.sign(
      {
        id: user.id,
        type: user.type,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TIME_EXPIRATION }
    );

    return token;
  }
}
