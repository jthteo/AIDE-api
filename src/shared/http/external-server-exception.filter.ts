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
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AxiosError } from 'axios';
import { WorkflowServiceException } from 'modules/workflows/workflow.service.exceptions';
import { MinoiClientException } from 'shared/minio/minio-client';
import {
  ExecutionsServiceException,
  ExecutionsServiceExceptionType,
} from 'modules/admin/executions/executions.service.exceptions';
import { ElasticClientException } from 'shared/elastic/elastic-client';

@Catch(Error)
export default class ExternalServerExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(
    ExternalServerExceptionFilter.name,
  );

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error(exception, JSON.stringify(exception, null, 2));

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      return response.status(status).json({
        statusCode: status,
        message: exception.message,
      });
    }

    if (Object.keys(exception).includes('config')) {
      const { message, status } = (
        exception as AxiosError
      ).toJSON() as ResponseException;

      if (
        status === HttpStatus.REQUEST_TIMEOUT ||
        status >= HttpStatus.INTERNAL_SERVER_ERROR
      ) {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            'An error occurred with an external service (MONAI, Clinical Review)',
        });
      }

      if (
        status === HttpStatus.BAD_REQUEST ||
        status === HttpStatus.NOT_FOUND
      ) {
        return response
          .status(status)
          .json((exception as AxiosError).response.data);
      }

      return response.status(status ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: status ?? HttpStatus.INTERNAL_SERVER_ERROR,
        message,
      });
    }

    if (exception instanceof WorkflowServiceException) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
      });
    }

    if (exception instanceof MinoiClientException) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An issue occurred with the MINIO service',
      });
    }

    if (exception instanceof ElasticClientException) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An issue occurred with the Elastic service',
      });
    }

    if (exception instanceof ExecutionsServiceException) {
      if (exception.type === ExecutionsServiceExceptionType.MISSING_TASK) {
        return response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: exception.message,
        });
      }
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
}

type ResponseException = {
  status: number;
  message: string;
};
