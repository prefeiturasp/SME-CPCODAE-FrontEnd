import { UntypedFormGroup, Validators } from '@angular/forms';

export function ConditionalRequiredValidator(masterControlLabel: string, operator: string, conditionalValue: any, slaveControlLabel: string) {
  return (group: UntypedFormGroup) => {
    const masterControl = group.controls[masterControlLabel];
    const slaveControl = group.controls[slaveControlLabel];

    if (slaveControl.errors && !slaveControl.errors['conditionalRequired']) {
      return;
    }

    if (eval(`'${masterControl.value}' ${operator} '${conditionalValue}'`)) {
      if (!slaveControl.value)
        {
          slaveControl.setErrors({ conditionalRequired: true });
          return;
        }
    }

    slaveControl.setErrors(null);
  }
}
