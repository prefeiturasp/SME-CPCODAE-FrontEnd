import { FormGroup, ValidationErrors } from '@angular/forms';

export function RequireCheckboxesToBeCheckedValidator(minRequired = 1): ValidationErrors | null {
  return (formGroup: FormGroup): ValidationErrors | null => {
      let checked = 0;

      Object.keys(formGroup.controls).forEach(key => {
          const control = formGroup.controls[key];

          if (control.value === true) {
              checked++;
          }
      });

      if (checked < minRequired) {
          return { requireCheckboxesToBeChecked: true };
      }

      return null;
  };
}