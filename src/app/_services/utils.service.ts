import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LocalStorageUtils } from '../_utils/localstorage';
import { SettingsService } from './settings.service';

@Injectable()
export class UtilsService {
    public localStorageUtils = new LocalStorageUtils();
    public maximum_year_supplied_value: number = 40000;
    
    constructor(private settingsService: SettingsService, private http: HttpClient) {
    }

    public getCurrentIp() : Observable<any> {
        
        // return this.http.get<any>('https://geolocation-db.com/json/');
        return this.http.get<any>('https://api.bigdatacloud.net/data/ip-geolocation?key=bdc_bb7369f168a74d0fbb325b46cb89127b');
    }
}