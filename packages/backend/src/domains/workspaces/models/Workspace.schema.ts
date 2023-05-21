import z from 'zod';
import { Workspace } from './Workspace.model.js';
import UserSchema from '../../users/models/User.schema.js';
import { AvailableActionsSchema } from 'src/models/Common.js';

export const WorkspaceActionsSchema = z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE', 'VISIBLE', 'EDITABLE']).array();

interface ToWorkspaceResponseOptions {
  withMembers?: boolean;
  withAvailableActions?: z.infer<typeof UserSchema.response>;
}
class WorkspaceSchema {
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

  static response = z.object({
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

  static async toResponse(workspace: Workspace, { withMembers = false, withAvailableActions = undefined }: ToWorkspaceResponseOptions = {}): Promise<z.infer<typeof this.response>> {
    const result: z.infer<typeof this.response> = {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      image: workspace.image,
    };

    if (withMembers) {
      const members = await workspace.members;
      const owner = await workspace.owner;
      if (members) result.members = members.map((user) => UserSchema.toResponse(user)) ?? [];
      if (owner) result.owner = UserSchema.toResponse(owner);
    }
    if (withAvailableActions) result.availableActions = await workspace.getAvailableActions(withAvailableActions);

    return result;
  }
}

export default WorkspaceSchema;
