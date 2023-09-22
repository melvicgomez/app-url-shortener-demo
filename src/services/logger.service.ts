import { LoggerService } from '@nestjs/common';

export class LogService implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    console.error('\u001b[31m%s', message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    console.debug(message, ...optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    console.info(message, ...optionalParams);
  }

  redirectJourneyLog?(transformedPortToRedirectPath: any[], UrlLink: string) {
    if (UrlLink) {
      console.log('----------- REDIRECT JOURNEY -----------');
      [...transformedPortToRedirectPath, UrlLink].map((url, i) =>
        console.log('\x1b[36m%s\x1b[0m \x1b[33m%s\x1b[0m', `[${i}]`, `${url}`),
      );
      console.log('-----------------------------------------');
    }
  }
}
