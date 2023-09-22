import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from './modules/Environment.module';
import { DatabaseModule } from './modules/database.module';
import { UrlShortenerService } from './services/url-shortener.service';
import { UrlShortenerController } from './controllers/url-shortener.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashedUrl } from './entities/hashed_url.entities';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { LogService } from './services/logger.service';

@Module({
  imports: [EnvModule, DatabaseModule, TypeOrmModule.forFeature([HashedUrl]), TerminusModule, HttpModule],
  controllers: [UrlShortenerController, AppController],
  providers: [AppService, UrlShortenerService, LogService],
})
export class AppModule {}
