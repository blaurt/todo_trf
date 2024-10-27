export enum UserStatus {
  ACTIVE = 'ACTIVE',
  NOT_VERIFIED = 'NOT_VERIFIED',
  BANNED = 'BANNED',
}

export type UserType = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  createdAt: Date;
};
