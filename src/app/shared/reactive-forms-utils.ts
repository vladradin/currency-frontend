import { debounceTime, tap, map, filter } from 'rxjs/operators';
import { FormGroup, AbstractControl } from '@angular/forms';
import { StringMap } from './utils';
import { Subject } from 'rxjs';

export interface ControlErrorMessages {
  controlName: string;
  errors: string[];
}


export function subscribeToValidationsChanges(form: FormGroup, controlName: string, validationsMessage: StringMap) {

  const control = form.get(controlName);
  const errorMessagesSubj = new Subject<ControlErrorMessages>();

  control.valueChanges
    .pipe(
      debounceTime(250),
      tap(() => errorMessagesSubj.next({ controlName, errors: undefined })),
      debounceTime(700),
      map(_ => getErrorMessages(control, validationsMessage)),
      filter(errorMessages => errorMessages.length > 0),
      map(errorMessages => errorMessagesSubj.next({ controlName, errors: errorMessages }))
    ).subscribe();

  return errorMessagesSubj;
}

export function getErrorMessages(control: AbstractControl, validationsMessage: StringMap): string[] {
  let errorMessages: Array<string> = [];
  if ((control.touched || control.dirty) && control.errors) {
    console.log(control.value);
    errorMessages = Object.keys(control.errors)
      .map(errorKey => validationsMessage[errorKey]);
  }

  return errorMessages;
}
