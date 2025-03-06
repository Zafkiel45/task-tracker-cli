/*
    unfortunately, there is a chance some internal error ocurred, as the 
    error object from "catch" block to be different from ErrnoException.

    The function below generates a personalized Error Object to internal 
    Errors, only. 
*/

export function internalError(cause: string): Error {
  const internalError = new Error();

  internalError.message = "❌ A internal error ocurried!";
  internalError.cause = cause; 
  internalError.name = "INTERNAL ERROR";
  
  return internalError;
}
