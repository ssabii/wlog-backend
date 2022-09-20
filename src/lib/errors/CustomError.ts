import StatusCode from "./enums/StatusCode";

class CustomError extends Error {
  public readonly code: StatusCode;

  constructor(code: StatusCode, message: string, ...params: any[]) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.code = code;
    this.message = message;
  }
}

export default CustomError;
