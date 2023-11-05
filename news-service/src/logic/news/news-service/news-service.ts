import { Inject, Injectable } from '@nestjs/common';
import { NEWS_REPO } from '../news-repo/news-repo';
import { CreateNewsItemDto } from '../dto/CreateNewsItem.dto';
import { User } from '../../../database/entities/User.entity';
import { AUTH_REPO } from '../../auth/auth-repo/auth-repo';
import { InternalError } from '../../../shared/errors/InternalError';
import { EditNewsItemDto } from '../dto/EditNewsItem.dto';
import { NewsItem } from '../../../database/entities/NewsItem.entity';
import { DeleteNewsItemDto } from '../dto/DeleteNewsItem.dto';

// Identifier for Dependency Injection
export const NEWS_SERVICE = 'NEWS_SERVICE';

// In-module dependency interface (Clean Architecture)
interface IDepNewsRepo {
  getVisibleNewsItems(): Promise<NewsItem[]>;
  getVisibleNewsItem(id: number): Promise<NewsItem | null>;
  insertNewsItem(payload: CreateNewsItemDto, author: User): Promise<void>;
  updateNewsItem(payload: NewsItem): Promise<void>;
}

// In-module dependency interface (Clean Architecture)
interface IDepUserRepo {
  getUserByEmail(email: string): Promise<User | null>;
}

// Service interface for flexible refactoring
export interface INewsService {
  getVisibleNewsItems(): Promise<NewsItem[]>;
  getVisibleNewsItem(newsItemId: number): Promise<NewsItem>;
  createNewsItem(
    payload: CreateNewsItemDto,
    authorEmail: string,
  ): Promise<void>;
  editNewsItem(payload: EditNewsItemDto, authorEmail: string): Promise<void>;
  deleteNewsItem(payload: DeleteNewsItemDto, userEmail: string): Promise<void>;
}

@Injectable()
export class NewsService implements INewsService {
  constructor(
    @Inject(NEWS_REPO) private readonly newsRepo: IDepNewsRepo,
    @Inject(AUTH_REPO) private readonly userRepo: IDepUserRepo,
  ) {}

  async getVisibleNewsItems() {
    const newsItems = await this.newsRepo.getVisibleNewsItems();
    return newsItems;
  }

  async getVisibleNewsItem(newsItemId: number) {
    const newsItem = await this.newsRepo.getVisibleNewsItem(newsItemId);
    if (!newsItem) throw new InternalError('News item is not found.');
    return newsItem;
  }

  async createNewsItem(payload: CreateNewsItemDto, authorEmail: string) {
    const author = await this.userRepo.getUserByEmail(authorEmail);
    if (!author) throw new InternalError('Author is not found.');

    await this.newsRepo.insertNewsItem(payload, author);
  }

  async editNewsItem(payload: EditNewsItemDto, editorEmail: string) {
    const editor = await this.userRepo.getUserByEmail(editorEmail);
    if (!editor) throw new InternalError('Editor is not found.');

    const newsItem = await this.newsRepo.getVisibleNewsItem(payload.newsItemId);
    if (!newsItem)
      throw new InternalError('News item for editing is not found.');

    if (editor.id !== newsItem.author.id)
      throw new InternalError('You are not allowed to edit this content!');

    let changed = false;
    if (payload.title && payload.title !== newsItem.title) {
      newsItem.title = payload.title;
      changed = true;
    }
    if (payload.text && payload.text !== newsItem.text) {
      newsItem.text = payload.text;
      changed = true;
    }
    if (changed) {
      newsItem.updatedAt = new Date();
      await this.newsRepo.updateNewsItem(newsItem);
    }
  }

  async deleteNewsItem(payload: DeleteNewsItemDto, userEmail: string) {
    const user = await this.userRepo.getUserByEmail(userEmail);
    if (!user) throw new InternalError('User is not found.');

    const newsItem = await this.newsRepo.getVisibleNewsItem(payload.newsItemId);
    if (!newsItem)
      throw new InternalError('News item for deletion is not found.');

    if (user.id !== newsItem.author.id)
      throw new InternalError('You are not allowed to delete this content!');

    newsItem.deletedAt = new Date();

    await this.newsRepo.updateNewsItem(newsItem);
  }
}
