import { z } from 'zod';

import { UserSchema } from './User';

export type CreatableResponse = z.infer<typeof CreatableSchema.response>;
export class CreatableSchema {
  static response = z.object({
    createdAt: z.date(),
    createdBy: UserSchema.response.optional(),
  });
}

export type ModifiableResponse = z.infer<typeof ModifiableSchema.response>;
export class ModifiableSchema extends CreatableSchema {
  static override response  = CreatableSchema.response.extend({
    lastModifiedAt: z.date().optional(),
    lastModifiedBy: UserSchema.response.optional(),
  });
}

export type AvailableActions = z.infer<typeof AvailableActionsSchema>;
export const AvailableActionsSchema = z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE']).array();
