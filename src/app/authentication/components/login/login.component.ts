import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { debounceTime, map, tap, filter } from 'rxjs/operators';
import { StringMap, ErrorsDescriptions, getErrorsDescription } from '../../../shared/utils';
import { subscribeToValidationsChanges, ControlErrorMessages } from 'src/app/shared/reactive-forms-utils';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  userValidationMessages: StringMap = {
    required: 'username is required',
    minlength: 'username length is to short'
  };

  passwordValidationMessages: StringMap = {
    required: 'password is required',
    minlength: 'password length is to short'
  };

  activeValidationErrors: { [key: string]: Array<string> } = {};

  readonly userControlName = 'username';
  readonly passwordControlName = 'password';

  readonly credentialsMinLength = 5;
  actionsSuccesResults = [];

  constructor(
    private authenticationSvc: AuthenticationService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {

    this.loginForm = this.fb.group({
      [this.userControlName]: ['', [Validators.required, Validators.minLength(this.credentialsMinLength)]],
      [this.passwordControlName]: ['', [Validators.required, Validators.minLength(this.credentialsMinLength)]]
    });

    subscribeToValidationsChanges(this.loginForm, this.userControlName, this.userValidationMessages)
      .subscribe(validation => this.updateValidations(validation));
    subscribeToValidationsChanges(this.loginForm, this.passwordControlName, this.passwordValidationMessages)
      .subscribe(validation => this.updateValidations(validation));
  }

  updateValidations(validationsResult: ControlErrorMessages) {
    const controlName = validationsResult.controlName;
    this.activeValidationErrors[controlName] = validationsResult.errors;
  }

  login() {
    this.authenticationSvc.login(this.loginForm.value).subscribe(
      _ => this.onLoginSuccesfully(),
      error => this.onLoginFailed(error)
    );
  }

  onLoginSuccesfully(): void {
    this.router.navigate(['currency', 'converter']);
  }

  private onLoginFailed(errors: ErrorsDescriptions) {
    this.actionsSuccesResults = getErrorsDescription(errors);
  }

  isUsernameInvalid() {
    return this.isControlInvalid(this.userControlName);
  }

  isPasswordInvalid() {
    return this.isControlInvalid(this.passwordControlName);
  }

  isControlInvalid(controlName: string) {
    const controlActiveValidationErrors = this.activeValidationErrors[controlName];

    if (controlActiveValidationErrors) {
      return !!controlActiveValidationErrors.length;
    }

    return false;
  }
}
