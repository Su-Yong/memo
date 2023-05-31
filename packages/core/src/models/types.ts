import { Lazy } from './lazy';

// Common
export interface Creatable {
  createdAt: Date;
  createdBy?: User;
}
export interface Modifiable extends Creatable {
  lastModifiedAt: Date;
  lastModifiedBy?: User;
}

// Users
export type UserPermission = 'admin' | 'member' | 'guest';
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  profile?: string;
  permission: UserPermission;

  workspaces: Lazy<Workspace[]>;
}

// Workspaces
export interface Workspace extends Modifiable {
  id: number;
  name: string;
  description?: string;
  image?: string;
  visibleRange: 'public' | 'link' | 'member';
  editableRange: 'public' | 'link' | 'member' | 'owner';

  members?: Lazy<User[]>;
  owner: Lazy<User>;
  memos: Lazy<Memo[]>;
}

// Memos
export interface Memo extends Modifiable {
  id: string;
  name: string;
  image?: string;
  content?: Buffer;

  visibleRange: 'public' | 'link' | 'member';
  editableRange: 'public' | 'link' | 'member' | 'owner';

  workspace: Lazy<Workspace>;
  children: Lazy<Memo[]>;
  parent: Lazy<Memo>;
}

// Files
export interface FileMetadata extends Creatable {
  id: string;
  fileName: string;
  mimeType: string;
  md5: string;
}
