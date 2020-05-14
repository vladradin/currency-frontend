import { HttpErrorResponse } from "@angular/common/http";

export interface StringMap { [key: string]: string; }

const GatewayTimeout = 504;
const ServerProcessingError = 500;
const NotAuthorized = 403;
const NotAuthenticated = 401;


const friendlyErrorMessages = {
  [GatewayTimeout]: 'Can\'t reach our server at the moment, please try later',
  [ServerProcessingError]: 'We have a problem processing you request, please contact our support team',
  [NotAuthorized]: 'You are not authorized to acess this resource',
  [NotAuthenticated]: 'You are not authenticated , please sign in'
};

export function mapToFriendlierName(errorResponse: HttpErrorResponse) {
  const friendlyErrorMessage = friendlyErrorMessages[errorResponse.status];

  if (friendlyErrorMessage) {
    return [friendlyErrorMessage];
  } else if (errorResponse.error) {
    return errorResponse.error;
  }

  return [errorResponse.statusText];
}

export type ErrorsDescriptions = string[] | { [key: string]: string[] };

export function getErrorsDescription(errors: ErrorsDescriptions) {
  if (errors instanceof Array) {
    return errors;
  } else {
    let errorList = [];
    for (const prop in errors) {
      if (errors[prop] instanceof Array) {
        errorList = [...errorList, ...errors[prop]];
      }
    }
    return errorList;
  }
}
