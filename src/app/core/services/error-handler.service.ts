import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) { }

    handleError(error: any): void {
        const logger = this.injector.get(LoggerService);

        // Extract error message
        const message = error.message ? error.message : error.toString();

        // Log the error
        logger.error('Unhandled Exception caught by GlobalErrorHandler', error);

        // In a real production app, we might also send this to an external service like Sentry
        // or show a user-friendly notification via a Toast service.

        // For now, we Re-throw to allow default browser handling (optional)
        // throw error;
    }
}
