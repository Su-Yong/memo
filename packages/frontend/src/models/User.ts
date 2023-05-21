export interface User {
  id: number;
  email: string;
  name: string;
  permission: 'admin' | 'member' | 'guest';
}
