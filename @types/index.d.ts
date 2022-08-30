import { JwtPayload } from "jsonwebtoken";
import UserModel from "../src/models/User";

declare global {
  namespace Express {
    interface User extends UserModel {}
  }
}
