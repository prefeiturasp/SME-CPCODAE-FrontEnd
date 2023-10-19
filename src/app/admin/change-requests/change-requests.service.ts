import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from '../../_services/settings.service'

@Injectable({ providedIn: 'root', })
export class ChangeRequestsService {
  private domain: string = 'solicitacao-alteracao';

  constructor(private settingsService: SettingsService) { }

  getChangesRequests(): Observable<any> {
    const url = `${this.domain}`;
    return this.settingsService.executeGet(url);
  }
}
