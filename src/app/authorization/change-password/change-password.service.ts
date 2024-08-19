import { Injectable } from '@angular/core';

import { SettingsService } from 'src/app/_services/settings.service';

@Injectable()
export class ChangePasswordService {
    constructor(
        private settingsService: SettingsService
    ) {}
    
    changePassword(email: string, password: string) {
        return this.settingsService.executePost('trocar-senha', { email, password });
    }
}
