import { AbstractControl } from "@angular/forms";

export class PhoneNumberValidator {
    static phone(controle: AbstractControl) {
        if (!controle.value || controle.value.trim().length == 0)
            return null;

        const phoneNumber = controle.value.replace(/[^\d]+/g, '');
        const isValid = phoneNumber.length === 10 || phoneNumber.length === 11;

        if (isValid) return null;

        return { phoneNumberInvalid: true };
    }
}