import { User } from "./user.interface"

export interface VerifyMfaResponse {
    user: User;
    token: string;
  }