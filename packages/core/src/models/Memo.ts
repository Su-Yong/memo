import { z } from 'zod';
import { AvailableActions, ModifiableSchema } from './Common';
import { WorkspaceSchema } from './Workspace';
import { AvailableActionsSchema } from './Common';

export type MemoRequest = z.infer<typeof MemoSchema.create>;
export type MemoUpdate = z.infer<typeof MemoSchema.update>;
export type MemoResponse = z.infer<typeof MemoSchema.response>;
export type MemoTreeResponse = MemoResponse & {
  children?: MemoTreeResponse[];
  parent?: MemoTreeResponse;
};

export class MemoSchema extends ModifiableSchema {
  static create = z.object({
    workspaceId: z.number(),
    parentId: z.string().optional(),

    name: z.string().min(1),
    image: z.string().optional(),
    visibleRange: z.enum(['public', 'link', 'member']).optional(),
    editableRange: z.enum(['public', 'link', 'member', 'owner']).optional(),
  });

  static update = z.object({
    name: z.string().min(1).optional(),
    image: z.string().optional(),
    visibleRange: z.enum(['public', 'link', 'member']).optional(),
    editableRange: z.enum(['public', 'link', 'member', 'owner']).optional(),
  });

  static override response = ModifiableSchema.response.extend({
    id: z.string(),
    name: z.string(),
    content: z.string().optional(),
    image: z.string().optional(),
    workspace: WorkspaceSchema.response.optional(),
    availableActions: AvailableActionsSchema.optional(),
  });

  static treeResponse: z.ZodType<MemoTreeResponse> = MemoSchema.response.extend({
    children: z.lazy(() => MemoSchema.treeResponse.array()).optional(),
    parent: z.lazy(() => MemoSchema.treeResponse).optional(),
  });
}
