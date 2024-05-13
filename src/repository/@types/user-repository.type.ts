export interface UserCreateRepository {
  email: string;
  password?: string;
  googleId?: string
}
export interface UserUpdateRepository {
  email?: string;
  password?: string;
  googleId?: string
}


