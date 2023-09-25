import { User } from "./user.interface"

export interface TokenUser {
    message: string
    data: Data
  }
  
  export interface Data {
    token: string
    user: User
  }