import { IRole } from "./i-role";

export interface IUser {
    _id: string,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    roles: IRole[],
    avatar: object,
}
