import { UserRepository } from "src/user/domain/UserRepository";
import { JwtEncoder } from "../domain/services/JwtEncoder";
import { ITokenPayload } from "../domain/interfaces/ITokenPayload";

export class GetMyProfile {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtEncoder: JwtEncoder
  ) {}

  async run(params: { token: string }) {
    const payload = this.jwtEncoder.decode<ITokenPayload>(params.token);

    const user = await this.userRepository.findById(payload.id);

    if (!user) {
      throw new Error("User not found");
    }

    const { password, ...data } = user.toPrimitives();

    return data;
  }
}
