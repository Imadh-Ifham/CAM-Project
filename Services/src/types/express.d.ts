import type { IUserDocument } from "../../modules/auth/models/User";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      userDoc?: IUserDocument;
    }
  }
}

export {};
