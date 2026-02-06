import { Injectable, isDevMode } from '@angular/core';

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

@Injectable({
    providedIn: 'root'
})
export class LoggerService {
    private level: LogLevel = isDevMode() ? LogLevel.DEBUG : LogLevel.INFO;

    debug(message: string, ...args: any[]): void {
        if (this.level <= LogLevel.DEBUG) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }

    info(message: string, ...args: any[]): void {
        if (this.level <= LogLevel.INFO) {
            console.info(`[INFO] ${message}`, ...args);
        }
    }

    warn(message: string, ...args: any[]): void {
        if (this.level <= LogLevel.WARN) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    }

    error(message: string, error?: any, ...args: any[]): void {
        if (this.level <= LogLevel.ERROR) {
            console.error(`[ERROR] ${message}`, error, ...args);
        }
    }

    setLogLevel(level: LogLevel): void {
        this.level = level;
    }
}
