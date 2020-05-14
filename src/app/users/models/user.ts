export interface User {
  username: string;
  jwt: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserRegistrationInfo {
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;
}

export interface Token {
  value: string;
}
