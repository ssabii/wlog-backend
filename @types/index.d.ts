import UserModel from "../src/models/user";

declare module Express {
  export interface User extends UserModel {}
}
