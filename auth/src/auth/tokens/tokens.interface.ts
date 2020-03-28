export interface RefreshToken {
  value: string;
  userId?: string;
  expiresAt: Date;
  ipAddress?: string;
}
