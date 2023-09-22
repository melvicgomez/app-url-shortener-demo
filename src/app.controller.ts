import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  get(@Res() response: Response) {
    return response.sendStatus(204);
  }
}
