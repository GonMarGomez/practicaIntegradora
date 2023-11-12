export default class CustomError {
  static createError({ name = "Error", cause, message, code = 1 }) {
    const error = new Error();
    error.name = name;
    error.message = message;
    error.code = code;
    error.cause = cause;

    throw error;
  }
}