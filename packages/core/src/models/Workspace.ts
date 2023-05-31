import { z } from 'zod';
import { ModifiableSchema } from './Common';
import { UserResponse, UserSchema } from './User';

export type WorkspaceActions = z.infer<typeof WorkspaceActionsSchema>;
export const WorkspaceActionsSchema = z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE', 'VISIBLE', 'EDITABLE']).array();

export type WorkspaceRequest = z.infer<typeof WorkspaceSchema.create>;
export type WorkspaceUpdate = z.infer<typeof WorkspaceSchema.update>;
export type WorkspaceResponse = z.infer<typeof WorkspaceSchema.response>;
export type WorkspaceMember = z.infer<typeof WorkspaceSchema.member>;

export class WorkspaceSchema extends ModifiableSchema {
  static create = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    image: z.string().optional(),
    visibleRange: z.enum(['public', 'link', 'member']).optional(),
    editableRange: z.enum(['public', 'link', 'member', 'owner']).optional(),
  });

  static update = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    visibleRange: z.enum(['public', 'link', 'member']).optional(),
    editableRange: z.enum(['public', 'link', 'member', 'owner']).optional(),
  });

  static override response = ModifiableSchema.response.extend({
    id: z.number(),
    name: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    members: UserSchema.response.array().optional(),
    owner: UserSchema.response.optional(),
    availableActions: WorkspaceActionsSchema.optional(),
  });

  static member = z.object({
    memberId: z.number(),
  });
}
