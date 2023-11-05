import { createStubInstance } from 'sinon';
import { NewsRepo } from '../news-repo/news-repo';
import { AuthRepo } from '../../auth/auth-repo/auth-repo';
import { NewsService } from './news-service';
import { NewsItem } from '../../../database/entities/NewsItem.entity';
import { InternalError } from '../../../shared/errors/InternalError';
import { CreateNewsItemDto } from '../dto/CreateNewsItem.dto';
import { User } from '../../../database/entities/User.entity';
import { EditNewsItemDto } from '../dto/EditNewsItem.dto';
import { DeleteNewsItemDto } from '../dto/DeleteNewsItem.dto';

describe('NewsService', () => {
  describe('Get visible news items', () => {
    it('OK', async () => {
      const newsRepoMock = createStubInstance(NewsRepo);
      const list = [new NewsItem()];
      newsRepoMock.getVisibleNewsItems.resolves(list);
      const userRepoMock = createStubInstance(AuthRepo);
      const service = new NewsService(newsRepoMock, userRepoMock);

      const result = await service.getVisibleNewsItems();
      expect(result).toStrictEqual(list);
      expect(newsRepoMock.getVisibleNewsItems.callCount).toEqual(1);
    });
  });

  describe('Get visible news item', () => {
    it('FAIL - news item is not found', async () => {
      const newsRepoMock = createStubInstance(NewsRepo);
      newsRepoMock.getVisibleNewsItem.resolves(null);
      const userRepoMock = createStubInstance(AuthRepo);
      const service = new NewsService(newsRepoMock, userRepoMock);

      try {
        await service.getVisibleNewsItem(1);
      } catch (error) {
        expect(error instanceof InternalError).toBeTruthy();
      }
      expect(newsRepoMock.getVisibleNewsItem.callCount).toEqual(1);
    });

    it('OK', async () => {
      const newsRepoMock = createStubInstance(NewsRepo);
      const item = new NewsItem();
      newsRepoMock.getVisibleNewsItem.resolves(item);
      const userRepoMock = createStubInstance(AuthRepo);
      const service = new NewsService(newsRepoMock, userRepoMock);

      const result = await service.getVisibleNewsItem(1);
      expect(result).toStrictEqual(item);
      expect(newsRepoMock.getVisibleNewsItem.callCount).toEqual(1);
    });
  });

  describe('Create news item', () => {
    it('FAIL - author user is not found', async () => {
      const newsRepoMock = createStubInstance(NewsRepo);
      const userRepoMock = createStubInstance(AuthRepo);
      userRepoMock.getUserByEmail.resolves(null);
      const service = new NewsService(newsRepoMock, userRepoMock);
      const dto = new CreateNewsItemDto();
      dto.text = 'test text';
      dto.title = 'test title';

      try {
        await service.createNewsItem(dto, 'test@ya.ru');
      } catch (error) {
        expect(error instanceof InternalError).toBeTruthy();
      }
      expect(userRepoMock.getUserByEmail.callCount).toEqual(1);
      expect(newsRepoMock.insertNewsItem.callCount).toEqual(0);
    });

    it('OK', async () => {
      const newsRepoMock = createStubInstance(NewsRepo);
      const userRepoMock = createStubInstance(AuthRepo);
      userRepoMock.getUserByEmail.resolves(new User());
      const service = new NewsService(newsRepoMock, userRepoMock);
      const dto = new CreateNewsItemDto();
      dto.text = 'test text';
      dto.title = 'test title';

      await service.createNewsItem(dto, 'test@ya.ru');
      expect(userRepoMock.getUserByEmail.callCount).toEqual(1);
      expect(newsRepoMock.insertNewsItem.callCount).toEqual(1);
    });
  });

  describe('Edit news item', () => {
    it('FAIL - editor user is not found', async () => {
      const newsRepoMock = createStubInstance(NewsRepo);
      const userRepoMock = createStubInstance(AuthRepo);
      userRepoMock.getUserByEmail.resolves(null);
      const service = new NewsService(newsRepoMock, userRepoMock);
      const dto = new EditNewsItemDto();
      dto.text = 'test text 2';
      dto.newsItemId = 1;

      try {
        await service.editNewsItem(dto, 'test@ya.ru');
      } catch (error) {
        expect(error instanceof InternalError).toBeTruthy();
      }

      expect(userRepoMock.getUserByEmail.callCount).toEqual(1);
      expect(newsRepoMock.getVisibleNewsItem.callCount).toEqual(0);
      expect(newsRepoMock.updateNewsItem.callCount).toEqual(0);
    });

    it('FAIL - news item is not found', async () => {
      const newsRepoMock = createStubInstance(NewsRepo);
      newsRepoMock.getVisibleNewsItem.resolves(null);
      const userRepoMock = createStubInstance(AuthRepo);
      userRepoMock.getUserByEmail.resolves(new User());
      const service = new NewsService(newsRepoMock, userRepoMock);
      const dto = new EditNewsItemDto();
      dto.text = 'test text 2';
      dto.newsItemId = 1;

      try {
        await service.editNewsItem(dto, 'test@ya.ru');
      } catch (error) {
        expect(error instanceof InternalError).toBeTruthy();
      }

      expect(userRepoMock.getUserByEmail.callCount).toEqual(1);
      expect(newsRepoMock.getVisibleNewsItem.callCount).toEqual(1);
      expect(newsRepoMock.updateNewsItem.callCount).toEqual(0);
    });

    it('FAIL - editor is not author', async () => {
      const newsRepoMock = createStubInstance(NewsRepo);
      const author = new User();
      author.id = 1;
      const newsItem = new NewsItem();
      newsItem.author = author;
      const editor = new User();
      editor.id = 2;
      newsRepoMock.getVisibleNewsItem.resolves(newsItem);
      const userRepoMock = createStubInstance(AuthRepo);
      userRepoMock.getUserByEmail.resolves(editor);
      const service = new NewsService(newsRepoMock, userRepoMock);
      const dto = new EditNewsItemDto();
      dto.text = 'test text 2';
      dto.newsItemId = 1;

      try {
        await service.editNewsItem(dto, 'test@ya.ru');
      } catch (error) {
        expect(error instanceof InternalError).toBeTruthy();
      }

      expect(userRepoMock.getUserByEmail.callCount).toEqual(1);
      expect(newsRepoMock.getVisibleNewsItem.callCount).toEqual(1);
      expect(newsRepoMock.updateNewsItem.callCount).toEqual(0);
    });

    it('OK', async () => {
      const newsRepoMock = createStubInstance(NewsRepo);
      const author = new User();
      author.id = 1;
      const newsItem = new NewsItem();
      newsItem.text = 'test text';
      newsItem.title = 'test title';
      newsItem.author = author;
      newsRepoMock.getVisibleNewsItem.resolves(newsItem);
      const userRepoMock = createStubInstance(AuthRepo);
      userRepoMock.getUserByEmail.resolves(author);
      const service = new NewsService(newsRepoMock, userRepoMock);
      const dto = new EditNewsItemDto();
      dto.text = 'test text 2';
      dto.newsItemId = 1;

      await service.editNewsItem(dto, 'test@ya.ru');
      expect(userRepoMock.getUserByEmail.callCount).toEqual(1);
      expect(newsRepoMock.getVisibleNewsItem.callCount).toEqual(1);
      expect(newsRepoMock.updateNewsItem.callCount).toEqual(1);
    });
  });

  describe('Delete news item', () => {
    it('FAIL - user is not found', async () => {
      const newsRepoMock = createStubInstance(NewsRepo);
      const userRepoMock = createStubInstance(AuthRepo);
      userRepoMock.getUserByEmail.resolves(null);
      const service = new NewsService(newsRepoMock, userRepoMock);
      const dto = new DeleteNewsItemDto();
      dto.newsItemId = 1;

      try {
        await service.deleteNewsItem(dto, 'test@ya.ru');
      } catch (error) {
        expect(error instanceof InternalError).toBeTruthy();
      }

      expect(userRepoMock.getUserByEmail.callCount).toEqual(1);
      expect(newsRepoMock.getVisibleNewsItem.callCount).toEqual(0);
      expect(newsRepoMock.updateNewsItem.callCount).toEqual(0);
    });

    it('FAIL - news item is not found', async () => {
      const newsRepoMock = createStubInstance(NewsRepo);
      newsRepoMock.getVisibleNewsItem.resolves(null);
      const userRepoMock = createStubInstance(AuthRepo);
      userRepoMock.getUserByEmail.resolves(new User());
      const service = new NewsService(newsRepoMock, userRepoMock);
      const dto = new DeleteNewsItemDto();
      dto.newsItemId = 1;

      try {
        await service.deleteNewsItem(dto, 'test@ya.ru');
      } catch (error) {
        expect(error instanceof InternalError).toBeTruthy();
      }

      expect(userRepoMock.getUserByEmail.callCount).toEqual(1);
      expect(newsRepoMock.getVisibleNewsItem.callCount).toEqual(1);
      expect(newsRepoMock.updateNewsItem.callCount).toEqual(0);
    });

    it('FAIL - news item is not found', async () => {
      const newsRepoMock = createStubInstance(NewsRepo);
      const author = new User();
      author.id = 1;
      const newsItem = new NewsItem();
      newsItem.author = author;
      const editor = new User();
      editor.id = 2;
      newsRepoMock.getVisibleNewsItem.resolves(newsItem);
      const userRepoMock = createStubInstance(AuthRepo);
      userRepoMock.getUserByEmail.resolves(editor);
      const service = new NewsService(newsRepoMock, userRepoMock);
      const dto = new DeleteNewsItemDto();
      dto.newsItemId = 1;

      try {
        await service.deleteNewsItem(dto, 'test@ya.ru');
      } catch (error) {
        expect(error instanceof InternalError).toBeTruthy();
      }

      expect(userRepoMock.getUserByEmail.callCount).toEqual(1);
      expect(newsRepoMock.getVisibleNewsItem.callCount).toEqual(1);
      expect(newsRepoMock.updateNewsItem.callCount).toEqual(0);
    });

    it('OK', async () => {
      const newsRepoMock = createStubInstance(NewsRepo);
      const author = new User();
      author.id = 1;
      const newsItem = new NewsItem();
      newsItem.author = author;
      newsRepoMock.getVisibleNewsItem.resolves(newsItem);
      const userRepoMock = createStubInstance(AuthRepo);
      userRepoMock.getUserByEmail.resolves(author);
      const service = new NewsService(newsRepoMock, userRepoMock);
      const dto = new DeleteNewsItemDto();
      dto.newsItemId = 1;

      await service.deleteNewsItem(dto, 'test@ya.ru');
      expect(userRepoMock.getUserByEmail.callCount).toEqual(1);
      expect(newsRepoMock.getVisibleNewsItem.callCount).toEqual(1);
      expect(newsRepoMock.updateNewsItem.callCount).toEqual(1);
    });
  });
});
