import { PasswordHasher } from "../../domain/services/PasswordHasher";
import * as bcrypt from "bcryptjs";

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, process.env.SALT_ROUNDS || 10);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
