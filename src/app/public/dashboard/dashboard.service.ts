import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SettingsService } from 'src/app/_services/settings.service';

@Injectable()
export class DashboardService {
    private domain: string = 'chamadas-publicas';

  constructor(
    private settingsService: SettingsService,
  ) {}

  clickGeneralInfoPanelEvent: EventEmitter<any> = new EventEmitter();

  get(id: string) : Observable<any> {
    const url = `${this.domain}/${id}`;
    return this.settingsService.executeGet(url);
  }

  getAll() : Observable<any> {
    return this.settingsService.executeGet(this.domain);
  }
}
