import { ILogin } from "../interfaces/i-login";

export class Login implements ILogin {
    constructor() {
        this.username = null;
        this.password = null;
        this.rememberPassword = false;
    }

    username: string;
    password: string;
    rememberPassword: boolean;
}
