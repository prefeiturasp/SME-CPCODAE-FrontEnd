import { Cooperative } from '../_models/cooperative.model';
import { User } from '../_models/user.model';

export class LocalStorageUtils {
    private _sme_cooperative: string = 'sme.c';
    private _sme_user: string = 'sme.u';

    public clearLoggedData() {
        localStorage.removeItem(this._sme_cooperative);
        localStorage.removeItem(this._sme_user);
    }

    public getCooperative(): Cooperative | null {
        const cooperative = localStorage.getItem(this._sme_cooperative);

        if (!cooperative)
            return null;

        return JSON.parse(cooperative);
    }

    public getUser(): User | null {
        const user = localStorage.getItem(this._sme_user);

        if (!user)
            return null;

        return JSON.parse(user);
    }

    public saveCooperative(cooperative: Cooperative) {
        localStorage.setItem(this._sme_cooperative, JSON.stringify(cooperative));
    }

    public saveUser(user: User) {
        localStorage.setItem(this._sme_user, JSON.stringify(user));
    }

    public saveUserKeepToken(user: User) {
        const currentUser = this.getUser();

        if (currentUser)
            user.token = currentUser.token;

        localStorage.setItem(this._sme_user, JSON.stringify(user));
    }
}