import { Injectable } from '@nestjs/common';
import { shuffleArray } from './utils/helpers';
import { Repository } from 'typeorm';
import { HashedUrl } from './entities/hashed_url.entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(HashedUrl)
    private hashedUrlRepository: Repository<HashedUrl>,
  ) {}
  get(): string {
    return `Demo Atlantis (${process.env.NODE_ENV})`;
  }

  /**
   * @param urlParam Hash the URL provided in the request param
   * @returns {string} hashed value of the url using bcrypt.hash
   */
  async findUrlRedirectJourney(hashedStr: string): Promise<string[]> {
    const obj = await this.hashedUrlRepository.findOneBy({
      HashValue: hashedStr,
    });
    const shuffledPorts = shuffleArray<string>(obj.Ports.split(',')).splice(0, 2);

    return shuffledPorts;
  }
}
