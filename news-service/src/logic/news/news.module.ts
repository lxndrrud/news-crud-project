import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NEWS_REPO, NewsRepo } from './news-repo/news-repo';
import { NEWS_SERVICE, NewsService } from './news-service/news-service';
import { DatabaseModule } from 'src/database/database.module';
import { SharedModule } from 'src/shared/shared.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, SharedModule, AuthModule],
  controllers: [NewsController],
  providers: [
    {
      provide: NEWS_REPO,
      useClass: NewsRepo,
    },
    {
      provide: NEWS_SERVICE,
      useClass: NewsService,
    },
  ],
})
export class NewsModule {}
