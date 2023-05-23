export interface User {
  id: number;
  email: string;
  name: string;
  profile?: string;
  permission: 'admin' | 'member' | 'guest';
}
