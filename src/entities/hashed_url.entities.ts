import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tbl_hashed_urls' })
export class HashedUrl {
  @PrimaryGeneratedColumn()
  HashedId: number;

  @Column({
    type: 'text',
  })
  UrlLink: string;

  @Column({
    type: 'text',
  })
  Host: string;

  @Column({
    type: 'text',
  })
  HashValue: string;

  @Column({
    type: 'varchar',
    length: 25,
  })
  Ports: string;
}
