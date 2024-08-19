import { UntypedFormGroup } from "@angular/forms";
import { isValidDate } from "../geral";

declare const isEmpty: any;

export class DateValidator {
    static validateRangeDates(startDateLabel: string, endDateLabel: string, startValidateToday: number, endValidateToday: number, 
        required: boolean, setValidatorEndControl: boolean = false) {
        return (formGroup: UntypedFormGroup) => {
            const startControl = formGroup.controls[startDateLabel];
            const endControl = formGroup.controls[endDateLabel];

            startControl.setErrors(null);
            endControl.setErrors(null);

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let startDate = new Date();
            let endDate = new Date();

            if (required && isEmpty(startControl.value))
                startControl.setErrors({ required: true });
            else if (startValidateToday >= 0 && !isEmpty(startControl.value)) {
                startDate = new Date(`${startControl.value} `);

                if (startValidateToday > 0 && !isEmpty(startControl.value)) {    
                    if (startValidateToday === 1 && startDate > today)
                        startControl.setErrors({ startDateGreaterThanToday: true });
                    else if (startValidateToday === 2 && startDate < today)
                        startControl.setErrors({ startDateLowerThanToday: true });
                }
            }

            if (required && isEmpty(endControl.value))
                endControl.setErrors({ required: true });
            else if (endValidateToday >= 0 && !isEmpty(endControl.value)) {
                endDate = new Date(`${endControl.value} `);
                
                if (!isValidDate(endDate))
                    endDate = new Date(`${endControl.value}`);

                if (endValidateToday > 0 && !isEmpty(endControl.value)) {    
                    if (endValidateToday === 1 && endDate > today)
                        endControl.setErrors({ endDateGreaterThanToday: true });
                    else if (endValidateToday === 2 && endDate < today)
                        endControl.setErrors({ endDateLowerThanToday: true });
                }
            }
            
            if (!startControl.errors && startDate > endDate) {
                if (!setValidatorEndControl)
                    startControl.setErrors({ startDateGreaterThanExpirationDate: true });
                else
                    endControl.setErrors({ startDateGreaterThanExpirationDate: true });
            }
        }
    }

    static validateDateLowerThanToday(dateLabel: string, required: boolean) {
        return (formGroup: UntypedFormGroup) => {
            const dateControl = formGroup.controls[dateLabel];
            dateControl.setErrors(null);

            if (required && !dateControl.value) {
                dateControl.setErrors({ required: true });
                return;
            }

            const today = new Date();
            let startDate = new Date();

            if (dateControl.value) {
                startDate = new Date(`${dateControl.value} `);

                if (startDate <= today)
                    dateControl.setErrors({ dateLowerThanToday: true });
            }
        }
    }
}