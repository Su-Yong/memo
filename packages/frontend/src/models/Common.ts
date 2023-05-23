import { User } from './User';

export interface Creatable {
  createdAt: string;
  createdBy: User;
}

export interface Modifiable extends Creatable {
  lastModifiedAt: string;
  lastModifiedBy: User;
}
