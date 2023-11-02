import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.entity';

@Entity({ name: 'public.news' })
export class NewsItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  updatedAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.news)
  author: User;
}
