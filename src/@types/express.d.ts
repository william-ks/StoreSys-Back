import { UserI } from "../entities/User";

declare global {
  namespace Express {
    export interface Request {
      user: Partial<UserI>;
    }
  }
}
