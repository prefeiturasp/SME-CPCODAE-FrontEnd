import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { CooperativeService } from 'src/app/cooperative/cooperative.service';

export class DapCafAlreadyExistsValidator {
    static createValidator(cooperativeService: CooperativeService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            let cnpj = control.value.trim();

            return of(null);

            // return cooperativeService
            //     .checkIfDAPExists(cnpj)
            //     .pipe(map((result: boolean) => result ? { DapCafAlreadyExistsValidator: true } : null));
        };
    }
}