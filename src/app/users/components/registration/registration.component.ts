import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UserRegistrationInfo } from '../../models/user';
import { getErrorsDescription, ErrorsDescriptions, StringMap } from 'src/app/shared/utils';
import { subscribeToValidationsChanges } from 'src/app/shared/reactive-forms-utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  minCredentialsLength = 5;

  userValidationMessages: StringMap = {
    required: 'username is required',
    minlength: 'username length is to short'
  };

  passwordValidationMessages: StringMap = {
    required: 'password is required',
    minlength: `password must be at least ${this.minCredentialsLength}`
  };

  emailValidationMessages: StringMap = {
    required: 'email is required',
    email: 'this is not a valid email'
  };


  readonly usernameControlName = 'username';
  readonly passwordControlName = 'password';
  readonly confirmedPasswordControlName = 'confirmedPassword';
  readonly emailControlName = 'email';

  registrationForm: FormGroup;

  actionsSuccesResults: {
    succces: string[],
    fails: string[]
  } = this.resetActionSuccessResults();

  activeValidationErrors: { [controlName: string]: string[] } = {
    [this.usernameControlName]: null,
    [this.passwordControlName]: null,
    [this.confirmedPasswordControlName]: null,
    [this.emailControlName]: null
  };

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private router: Router
  ) { }


  ngOnInit() {
    this.registrationForm = this.fb.group({
      [this.usernameControlName]: ['', [Validators.required, Validators.minLength(this.minCredentialsLength)]],
      [this.emailControlName]: ['', [Validators.required, Validators.email]],
      [this.passwordControlName]: ['', [Validators.required, Validators.minLength(this.minCredentialsLength)]],
      [this.confirmedPasswordControlName]: ['', [Validators.required, Validators.minLength(this.minCredentialsLength)]]
    });

    this.subscribeFormControlToValidationsChanges();
  }

  register() {
    const registrationInfo: UserRegistrationInfo = this.registrationForm.value;
    this.resetActionSuccessResults();
    this.userService.registerUser(registrationInfo).subscribe(
      () => this.onUserRegistrationSuccesfull(registrationInfo.username),
      (errors) => this.onUserRegistrationFailed(errors)
    );
  }

  private subscribeFormControlToValidationsChanges() {
    // username
    subscribeToValidationsChanges(this.registrationForm, this.usernameControlName, this.userValidationMessages)
      .subscribe(validation => this.updateValidations(validation));
    // password
    subscribeToValidationsChanges(this.registrationForm, this.passwordControlName, this.passwordValidationMessages)
      .subscribe(validation => this.updateValidations(validation));
    // password to confirm
    subscribeToValidationsChanges(this.registrationForm, this.confirmedPasswordControlName, this.passwordValidationMessages)
      .subscribe(validation => this.updateValidations(validation));
    // email
    subscribeToValidationsChanges(this.registrationForm, this.emailControlName, this.emailValidationMessages)
      .subscribe(validation => this.updateValidations(validation));
  }

  private updateValidations(validationsResult: { controlName: string, errors: string[] }) {
    const controlName = validationsResult.controlName;
    this.activeValidationErrors[controlName] = validationsResult.errors;
  }

  private resetActionSuccessResults() {
    this.actionsSuccesResults = {
      succces: null,
      fails: null
    };
    return this.actionsSuccesResults;
  }

  isControlInvalid(controlName: string) {
    const controlActiveValidationErrors = this.activeValidationErrors[controlName];

    if (controlActiveValidationErrors) {
      return !!controlActiveValidationErrors.length;
    }

    return false;
  }

  private onUserRegistrationSuccesfull(createdUsername: string) {
    this.actionsSuccesResults.succces = [
      `Succesfully created user ${createdUsername}`
    ];

    setTimeout(() => this.router.navigate(['/login']), 1500);
  }

  private onUserRegistrationFailed(errors: ErrorsDescriptions) {
    this.actionsSuccesResults.fails = getErrorsDescription(errors);
  }
}
