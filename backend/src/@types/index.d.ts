import { User as PrismaUser } from "../generated/prisma";

declare global {
  namespace Express {
    interface User extends Partial<PrismaUser> {
      _id?: any;
      currentWorkspace?: any;
    }
  }
}


