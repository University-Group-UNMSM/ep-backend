import { UserRepository } from "src/user/domain/UserRepository";
import { PasswordHasher } from "../domain/services/PasswordHasher";
import { JwtEncoder } from "../domain/services/JwtEncoder";
import { ITokenPayload } from "../domain/interfaces/ITokenPayload";

export class Login {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtEncoder: JwtEncoder
  ) {}

  async run(params: { email: string; password: string }) {
    const user = await this.userRepository.findByEmail(params.email);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await this.passwordHasher.compare(
      params.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = this.jwtEncoder.encode<ITokenPayload>({
      id: user.id.value,
      type: user.type,
      name: user.name,
      email: user.email,
    });

    return token;
  }
}
