import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ResponseInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                if (data instanceof Buffer) {
                    return data;
                }

                const response = context.switchToHttp().getResponse();
                const isAlreadyFormatted = data && typeof data === 'object' && 'statusCode' in data;

                if (isAlreadyFormatted) {
                    return data;
                }

                const message = data?.message || 'Success';

                return {
                    error: false,
                    statusCode: response.statusCode,
                    message,
                    data: data || null,
                };
            }),
            catchError((error) => {
                this.logger.error(error.message, error.stack);

                let message = Array.isArray(error.response?.message)
                    ? error.response.message.join(', ')
                    : error.response?.message || error.message;

                const errorResponse = {
                    error: true,
                    statusCode: error.status || 500,
                    message,
                    data: null,
                };

                this.logger.debug(errorResponse);

                throw new HttpException(errorResponse, errorResponse.statusCode);
            }),
        );
    }
}
