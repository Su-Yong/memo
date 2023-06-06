import { z } from 'zod';
import { UserSchema } from './User';

export type AccessToken = z.infer<typeof AuthSchema.accessToken>;
export type RefreshToken = z.infer<typeof AuthSchema.refreshToken>;
export type Token = z.infer<typeof AuthSchema.token>;
export type RefreshTokenRequest = z.infer<typeof AuthSchema.refreshTokenRequest>;

export class AuthSchema {
  static refreshTokenRequest = z.object({
    refreshToken: z.string(),
  });

  static accessToken = UserSchema.response.extend({
    type: z.literal('accessToken'),
    iat: z.number(),
    exp: z.number(),
  });

  static refreshToken = UserSchema.response.extend({
    type: z.literal('refreshToken'),
    iat: z.number(),
    exp: z.number(),
  });

  static token = z.union([this.accessToken, this.refreshToken]);
}
