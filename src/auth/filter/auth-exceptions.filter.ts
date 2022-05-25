import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  UnauthorizedException
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class AuthExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException
    ) {
      request.flash("loginError", "Please try again");
      response.redirect("/");
    } else {
      response.redirect("/error");
    }
  }
}