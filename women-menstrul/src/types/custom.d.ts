// src/types.d.ts or src/custom.d.ts
import { IUser } from '../models/User'; // Adjust the import as per your project structure

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
