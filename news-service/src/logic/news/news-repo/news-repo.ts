import { Inject, Injectable } from '@nestjs/common';
import { TYPEORM_CONNECTION } from '../../../database/TypeormConnection';
import { NewsItem } from '../../../database/entities/NewsItem.entity';
import { DataSource } from 'typeorm';
import { CreateNewsItemDto } from '../dto/CreateNewsItem.dto';
import { User } from '../../../database/entities/User.entity';

export const NEWS_REPO = 'NEWS_REPO';

export interface INewsRepo {
  getVisibleNewsItems(): Promise<NewsItem[]>;
  getVisibleNewsItem(id: number): Promise<NewsItem | null>;
  insertNewsItem(payload: CreateNewsItemDto, author: User): Promise<void>;
  updateNewsItem(payload: NewsItem): Promise<void>;
}

@Injectable()
export class NewsRepo implements INewsRepo {
  constructor(
    @Inject(TYPEORM_CONNECTION) private readonly connection: DataSource,
  ) {}

  async insertNewsItem(payload: CreateNewsItemDto, author: User) {
    const newItem = new NewsItem();
    newItem.title = payload.title;
    newItem.text = payload.text;
    newItem.author = author;

    await this.connection.createEntityManager().save(newItem);
  }

  async getVisibleNewsItem(id: number) {
    const newsItem = await this.connection
      .createQueryBuilder(NewsItem, 'news')
      .innerJoinAndSelect('news.author', 'author')
      .where('news.id = :id', { id })
      .andWhere('news.deletedAt IS NULL')
      .getOne();
    return newsItem;
  }

  async getVisibleNewsItems() {
    const newsItems = await this.connection
      .createQueryBuilder(NewsItem, 'news')
      .innerJoinAndSelect('news.author', 'author')
      .where('news.deletedAt IS NULL')
      .orderBy('news.createdAt', 'DESC')
      .getMany();
    return newsItems;
  }

  async updateNewsItem(payload: NewsItem) {
    await this.connection.createEntityManager().save(payload);
  }
}
