import { isValid, ulid } from "ulidx";

export class Ulid {
  readonly value: string;

  constructor(value: string) {
    this.ensureIsValidUlid(value);
    this.value = value;
  }

  static random(): Ulid {
    return new Ulid(ulid());
  }

  private ensureIsValidUlid(id: string): void {
    if (!isValid(id)) {
      throw new Error(`Invalid ULID: ${id}`);
    }
  }
}
