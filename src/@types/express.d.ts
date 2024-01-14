import User from "../api/v2/entities/Store";

declare global {
  namespace Express {
    export interface Request {
      user: Partial<User>;
    }
  }
}
