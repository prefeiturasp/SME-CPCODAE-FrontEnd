import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Bank } from '../_models/bank.model';

@Injectable()
export class BankService {
    constructor(private http: HttpClient) {
    }

    public getBankFromCode(code: string) : Observable<Bank> {
        return this.http.get<Bank>(`https://brasilapi.com.br/api/banks/v1/${code}`);
    }
}