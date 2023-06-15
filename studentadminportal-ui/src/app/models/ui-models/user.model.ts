import { Role } from "./role.model";

export interface User {
  id: string,
  firstName: string,
  lastName: string,
  userName: string,
  email: string,
  roleId: string,
  role: Role
}
