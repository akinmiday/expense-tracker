// import { Request } from "express";

// declare module "express-serve-static-core" {
//   interface Request {
//     userId?: string; // Add the userId property
//   }
// }

import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Add your custom property here
    }
  }
}
