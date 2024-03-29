/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AxiosError } from 'axios';
import {
  RoleServiceException,
  RoleServiceExceptionCode,
} from 'modules/roles/roles.service';
import {
  UserServiceException,
  UserServiceExceptionCode,
} from 'modules/users/users.service';

type ResponseException = {
  message: string;
  status: number;
};

@Catch(Error)
export class KeycloakAdminExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(
    KeycloakAdminExceptionFilter.name,
  );

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error(exception, JSON.stringify(exception, null, 2));

    if (exception instanceof RoleServiceException) {
      this.handleRoleException(exception, response);

      return;
    }

    if (exception instanceof UserServiceException) {
      this.handleUserException(exception, response);

      return;
    }

    if (Object.keys(exception).includes('config')) {
      const { message, status } = (
        exception as AxiosError
      ).toJSON() as ResponseException;

      response.status(status ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: status ?? HttpStatus.INTERNAL_SERVER_ERROR,
        message,
      });

      return;
    }

    const { message, status } = exception as unknown as ResponseException;

    if (status) {
      response.status(status).json({
        statusCode: status,
        message,
      });

      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }

  private handleRoleException(
    exception: RoleServiceException,
    response: Response,
  ) {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      case RoleServiceExceptionCode.ROLE_NOT_FOUND:
        status = HttpStatus.NOT_FOUND;
        message = exception.message;
        break;

      case RoleServiceExceptionCode.ROLE_NOT_EDITABLE:
        status = HttpStatus.FORBIDDEN;
        message = exception.message;
        break;

      case RoleServiceExceptionCode.ROLE_DUPLICATE:
        status = HttpStatus.CONFLICT;
        message = exception.message;
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }

  private handleUserException(
    exception: UserServiceException,
    response: Response,
  ) {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      case UserServiceExceptionCode.USER_NOT_FOUND:
        status = HttpStatus.NOT_FOUND;
        message = exception.message;
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
