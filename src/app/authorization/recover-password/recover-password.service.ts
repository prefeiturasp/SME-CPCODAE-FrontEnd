import { Injectable } from '@angular/core';

import { SettingsService } from 'src/app/_services/settings.service';

@Injectable()
export class RecoverPasswordService {
    constructor(
        private settingsService: SettingsService
    ) {}
    
    recoverPassword(email: string, password: string, token: string) {
        return this.settingsService.executePost('trocar-senha-token', { email, password, token });
    }
}
