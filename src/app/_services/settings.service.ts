import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable()
export class SettingsService {
    constructor(private http: HttpClient){ }

    executeDelete(url: string)
    {
        return this.http.delete<any>(`${this.getApiUrl()}/${url}`);
    }

    executeGet(url: string)
    {
        return this.http.get<any>(`${this.getApiUrl()}/${url}`);
    }

    executeGetBlob(url: string)
    {
        return this.http.get<any>(`${this.getApiUrl()}/${url}`, { responseType: 'blob' as any });
    }

    executePost(url: string, body: any)
    {
        return this.http.post<any>(`${this.getApiUrl()}/${url}`, body);
    }

    executePatch(url: string, body: any)
    {
        return this.http.patch<any>(`${this.getApiUrl()}/${url}`, body);
    }

    executePut(url: string, body: any)
    {
        return this.http.put<any>(`${this.getApiUrl()}/${url}`, body);
    }

    getApiUrl() { return `${environment.apiUrl}`; }
}
