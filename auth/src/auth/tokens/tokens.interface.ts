export interface RefreshToken {
  value: string;
  userId?: string;
  expiresAt: Date;
  clientId?: string;
  ipAddress?: string;
}
