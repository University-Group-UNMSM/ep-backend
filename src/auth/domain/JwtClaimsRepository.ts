export interface JwtClaimsRepository {
    sign(expiresIn: string): Promise<any>;
}