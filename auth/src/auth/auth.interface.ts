export interface JWTPayload {
  sub: string;
  iat?: string;
  jti?: string;
  exp?: number;
}

export enum GrantType {
  RefreshToken = 'refresh_token',
  Password = 'password',
  AuthorizationCode = 'authorization-code',
  Implicit = 'implicit',
  ClientCredentials = 'client-credentials',
}
