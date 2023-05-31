import { z } from 'zod';

export type UserRequest = z.infer<typeof UserSchema.create>;
export type UserUpdate = z.infer<typeof UserSchema.update>;
export type UserLogin = z.infer<typeof UserSchema.update>;
export type UserResponse = z.infer<typeof UserSchema.response>;

export class UserSchema {
  static create = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string(),
    profile: z.string().optional(),
  });

  static update = z.object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    name: z.string().optional(),
    profile: z.string().optional(),
  });

  static login = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  static response = z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string(),
    profile: z.string().optional(),
    permission: z.enum(['admin', 'member', 'guest']),
  });
}
