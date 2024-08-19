import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { CooperativeService } from 'src/app/cooperative/cooperative.service';
import { CepCpfCnpjValidator } from './cep-cpf-cnpj.validator';

export class CnpjAlreadyExistsValidator {
    static createValidator(cooperativeService: CooperativeService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            let cnpj = control.value.replace(/[^\d]+/g, '');

            if (!CepCpfCnpjValidator.checkIfCnpjIsValid(cnpj))
                return of(null);

            return of(null);

            // return cooperativeService
            //     .checkIfCNPJExists(cnpj)
            //     .pipe(map((result: boolean) => result ? { cnpjAlreadyExists: true } : null));
        };
    }
}