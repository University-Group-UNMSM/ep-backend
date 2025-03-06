import { sign, verify } from "jsonwebtoken";
import { JwtEncoder } from "src/auth/domain/services/JwtEncoder";
export class JsonwebtokenJwtEncoder implements JwtEncoder {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string
  ) {}

  encode(payload: any): string {
    return sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  decode(token: string): any {
    return verify(token, this.secret);
  }
}
