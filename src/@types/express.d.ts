import User from "../api/v2/entities/User";

declare global {
  namespace Express {
    export interface Request {
      user: Partial<User>;
    }
  }
}
