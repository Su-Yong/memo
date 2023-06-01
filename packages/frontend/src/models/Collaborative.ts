export interface CollaborativeUser {
  name: string;
  color: string;
  profile?: string;
};

export interface CollaborativeContext {
  user: CollaborativeUser;
  cursor: null | any; // TODO: 커서 타이핑 필요
  detached?: boolean;
}
