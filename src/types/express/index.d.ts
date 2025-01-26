import { Request } from "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string; // Add the userId property to the Request type
  }
}
