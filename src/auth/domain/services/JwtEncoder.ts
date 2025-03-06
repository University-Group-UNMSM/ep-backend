export interface JwtEncoder {
  encode<T>(payload: T): string;
  decode<T>(token: string): T;
}
  