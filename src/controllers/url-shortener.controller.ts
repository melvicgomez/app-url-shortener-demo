import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { Controller, Post, Get, Req, HttpException, HttpStatus, Res, Next } from '@nestjs/common';
import { UrlShortenerService } from 'src/services/url-shortener.service';
import { LogService } from 'src/services/logger.service';
import { fakeDelay, isBcryptHash, isValidUrl, shuffleArray } from 'src/utils/helpers';
import { SALT_OR_ROUNDS } from 'src/utils/constants';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller()
export class UrlShortenerController {
  constructor(
    private readonly service: UrlShortenerService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private logger: LogService,
  ) {}

  @Post('create-link')
  async createLink(@Req() request: Request, @Res() response: Response, @Next() next: NextFunction) {
    const host = process.env.APP_URL || '';
    const urlParam = (request?.query['url']?.toString() ?? '').trim();

    try {
      // Check url (final destination) provided is a valid URL
      if (isValidUrl(urlParam)) {
        // hash the URL link
        const hashedUrl = await bcrypt.hash(urlParam, SALT_OR_ROUNDS);

        await this.service.generateLinkWithHashValue(host, urlParam, hashedUrl);
        return response.send(host + '/' + hashedUrl);
      } else {
        throw new Error('URL request param is not valid URL');
      }
    } catch (error) {
      this.logger.error(error.message, HttpStatus.BAD_REQUEST);
      next(new HttpException(error.message, HttpStatus.BAD_REQUEST));
    }
  }

  @Get('get-link')
  async root(@Req() request: Request, @Res() response: Response, @Next() next: NextFunction) {
    const hashParam = request?.query['hash']?.toString() ?? '';
    try {
      let urlJourneyList: string[] = [];

      // Check hashParm if empty or not in bcrypt format
      if (hashParam && isBcryptHash(hashParam)) {
        // this is executed when API is called for the first time
        if (request.cookies.redirects === undefined) {
          this.logger.log('Start creating the URL journey');
          const hashedUrlObj = await this.service.findUrlObjByHash(hashParam);

          // filter the current port from the list of ports
          // then shuffle filtered ports to make the journey variation
          const shuffledPorts = shuffleArray<string>(
            hashedUrlObj.Ports.split(',').filter((port) => !request.get('host').endsWith(port)),
          ).splice(0, 2);

          // build and map ports to redirect URL
          const transformedPortToRedirectPath = shuffledPorts.map(
            (port) => request.protocol + '://' + request.hostname + ':' + port + request.url,
          );
          this.logger.redirectJourneyLog(transformedPortToRedirectPath, hashedUrlObj.UrlLink);
          urlJourneyList = [...transformedPortToRedirectPath];
          response.cookie('finalDestination', hashedUrlObj.UrlLink);
        }

        // on 1st trigger, updateUrlJourneyList will use [] queried from DB
        // on n-th redirect, updateUrlJourneyList will use [] from cookies
        const updateUrlJourneyList = request.cookies.redirects
          ? (request.cookies.redirects as string[])
          : urlJourneyList;

        // Logic for URL redirection
        if (updateUrlJourneyList.length === 0) {
          // when updateUrlJourneyList is an empty[], it means that all redirects are consumed/done
          response.clearCookie('redirects');
          response.clearCookie('finalDestination');

          // Extra checking if URL destination is still similar in the DB
          const hashedUrlObj = await this.service.findUrlObjByHash(hashParam);
          if (hashedUrlObj.UrlLink === request.cookies.finalDestination) {
            // add some delay before redirecting to final URL
            if (!isNaN(parseInt(process.env.DELAY_MS))) {
              await fakeDelay(parseInt(process.env.DELAY_MS));
            }

            this.logger.log(`[DONE] Redirecting to ${request.cookies.finalDestination}`);
            // redirect to the final URL
            // response.redirect(request.cookies.finalDestination);
            response.render('page-template', {
              delay: process.env.DELAY_MS,
              currentLink: decodeURI(request.protocol + '://' + request.get('host') + request.url),
              nextDestination: request.cookies.finalDestination,
            });
          } else {
            throw new Error('The URL final destination is not matched with hash.');
          }
        } else {
          this.logger.redirectJourneyLog(updateUrlJourneyList, request.cookies.finalDestination);

          const nextDestination = updateUrlJourneyList.shift(); // [*nextDestination*, ... n-th destination]

          // Check the response of http://127.0.0.1:{PORT}/health if 204 to validate the service is running and active
          // NOTE: Checking the URL http://127.0.0.1:{PORT}/get-link?hash={hash} causing an infinite redirection to each other
          const urlToCheck = new URL(nextDestination).origin;
          const healthStatus = await this.health.check([
            () => this.http.pingCheck('nextUrlDestinationOrigin', urlToCheck),
          ]);
          this.logger.log(
            `Health check: ${urlToCheck} - [${healthStatus.status} - ${healthStatus.info.nextUrlDestinationOrigin.status}]`,
          );

          // update the cookie value with new URL journeys
          response.cookie('redirects', updateUrlJourneyList);
          this.logger.log(`Redirecting to ${nextDestination}`);

          // FOR DEV purposes: add some delay before redirecting to next URL
          if (!isNaN(parseInt(process.env.DELAY_MS))) {
            await fakeDelay(parseInt(process.env.DELAY_MS));
          }

          // to show the URL redirection in browsing journey/experience
          response.render('page-template', {
            delay: process.env.DELAY_MS,
            currentLink: request.protocol + '://' + request.get('host') + request.url,
            nextDestination: nextDestination,
          });
        }
      } else {
        throw new Error('URL request param is not valid bcrypt hash');
      }
    } catch (error) {
      // Clear the cookies when error occured
      response.clearCookie('redirects');
      response.clearCookie('finalDestination');

      this.logger.error(error.message, error.status || HttpStatus.BAD_REQUEST);
      next(new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST));
    }
  }
}
