import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NewsItem } from './NewsItem.entity';

@Entity({ name: 'public.users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => NewsItem, (newsItem) => newsItem.author)
  news: NewsItem[];
}
