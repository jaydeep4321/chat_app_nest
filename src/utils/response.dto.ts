import { HttpException, HttpStatus } from '@nestjs/common';
// import { Serialize } from './interceptors/serialize.interceptor';
// import { UserDto } from './users/dtos/user.dto';

export class ResponseDto {
  sendSuccess(message: string, data: any, res: any): any {
    // console.log('function called!!', res);
    res.status(HttpStatus.OK).json({
      error: false,
      statusCode: HttpStatus.OK,
      message: message,
      data: data,
    });

    // console.log('completed function');
  }

  sendCreated(message: string, data: any, res: any): any {
    res.status(HttpStatus.CREATED).json({
      error: false,
      statusCode: HttpStatus.CREATED,
      message: message,
      data: data,
    });
  }

  sendNotFound(message: string, errorType?: string): any {
    console.log('function called!!', message);
    throw new HttpException(
      {
        statusCode: HttpStatus.NOT_FOUND,
        errorType: errorType,
        message: message,
        data: [],
      },
      HttpStatus.NOT_FOUND,
    );
    // new HttpException('send Null', HttpStatus.NOT_FOUND);
    // console.log('completed function');
  }

  sendBadRequest(message: string, errorType?: string): any {
    console.log('called');
    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        errorType: errorType,
        message: message,
        data: [],
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  sendUnAuthorised(message: string, errorType?: string): any {
    console.log('called');
    throw new HttpException(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        errorType: errorType,
        message: message,
        data: [],
      },
      HttpStatus.UNAUTHORIZED,
    );
  }

  sendForbidden(message: string, errorType?: string): any {
    console.log('called');
    throw new HttpException(
      {
        statusCode: HttpStatus.FORBIDDEN,
        errorType: errorType,
        message: message,
        data: [],
      },
      HttpStatus.FORBIDDEN,
    );
  }

  sendInternalServerError(message: string, errorType?: string): any {
    throw new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorType: errorType,
        message: message,
        data: [],
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
