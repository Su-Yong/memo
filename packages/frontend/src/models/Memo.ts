import { Modifiable } from './Common';
import { Workspace } from './Workspace';

export interface Memo extends Modifiable {
  id: string;
  name: string;
  content: string;
  image?: string;

  workspace: Workspace;

  children?: Memo[];
}

export interface RequestMemo {
  workspaceId: number;
  parentId?: number;

  name: string;
  image?: string;
  visibleRange?: 'public' | 'link' | 'member';
  editableRange?: 'public' | 'link' | 'member' | 'owner';
}

export type UpdateMemo = Partial<Omit<RequestMemo, 'workspaceId' | 'parentId'>>;
