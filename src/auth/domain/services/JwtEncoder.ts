export interface JwtEncoder {
    encode(payload: any): string;
    decode(token: string): any;
  }
  