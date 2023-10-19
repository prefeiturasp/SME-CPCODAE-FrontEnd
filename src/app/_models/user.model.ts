export class User {
    id: string;
    email: string;
    name: string;
    firstName: string;
    token: string;
    role: string;
    roles: string[];
    is_active: boolean;

    constructor() {
        this.id = '';
        this.email = '';
        this.name = '';
        this.firstName = '';
        this.token = '';
        this.role = '';
        this.roles = [];
        this.is_active = true;
    }
}