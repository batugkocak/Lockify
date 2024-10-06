import { Response } from "express";
import { HTTP_STATUS } from "../constants/httpCodes";

export class ApiResponse<T> {
  public status: number;
  public message: string;
  public data: T | null;
  public errors: string[] | null;

  constructor(
    status: number,
    message: string,
    data: T | null = null,
    errors: string[] | null = null
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  public send(res: Response): void {
    res.status(this.status).json({
      status: this.status,
      message: this.message,
      data: this.data,
      errors: this.errors,
    });
  }
}

export class SuccessResponse<T> extends ApiResponse<T> {
  constructor(
    data: T | null = null,
    message: string = "Success",
    status: number = 200
  ) {
    super(status, message, data, null);
  }

  public send(res: Response): void {
    super.send(res);
  }
}

export class ErrorResponse extends ApiResponse<null> {
  constructor(
    message: string = "An error occurred",
    status: number = HTTP_STATUS.BAD_REQUEST,
    errors: string[] | string | null = null
  ) {
    super(
      status,
      message,
      null,
      errors ? (Array.isArray(errors) ? errors : [errors]) : null
    );
  }
}
