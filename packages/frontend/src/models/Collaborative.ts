export interface CollaborativeUser {
  id: number;
  name: string;
  color: string;
  profile?: string;
};

export interface CollaborativeContext {
  user: CollaborativeUser;
  cursor: null | any; // TODO: 커서 타이핑 필요
  attached?: boolean;
}
