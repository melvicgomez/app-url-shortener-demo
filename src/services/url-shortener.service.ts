import { Injectable } from '@nestjs/common';
import { HashedUrl } from 'src/entities/hashed_url.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as config from 'src/config.json';

@Injectable()
export class UrlShortenerService {
  constructor(
    @InjectRepository(HashedUrl)
    private hashedUrlRepository: Repository<HashedUrl>,
  ) {}

  /**
   * @param urlParam Hash the URL provided in the request param
   * @returns {string} hashed value of the url using bcrypt.hash
   */
  async generateLinkWithHashValue(host: string, urlParam: string, hashedUrl: string): Promise<HashedUrl> {
    const h = new HashedUrl();
    h.Host = host; // https://localhost:3000
    h.UrlLink = urlParam; // ?url={https://domain.com}
    h.HashValue = hashedUrl; // urlParam's bcrypt hash value
    h.Ports = Object.values(config.PORTS).toString();

    return this.hashedUrlRepository.save(h);
  }

  /**
   * @param urlParam Hash the URL provided in the request param
   * @returns {string} hashed value of the url using bcrypt.hash
   */
  async findUrlObjByHash(hashedStr: string): Promise<HashedUrl> {
    const hashedUrlObj = await this.hashedUrlRepository.findOneBy({
      HashValue: hashedStr,
    });

    if (hashedUrlObj) {
      return hashedUrlObj;
    } else {
      throw new Error('Hash not found.');
    }
  }
}
