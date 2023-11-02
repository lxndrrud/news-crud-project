import { Module } from '@nestjs/common';
import { AuthModule } from './logic/auth/auth.module';
import { NewsModule } from './logic/news/news.module';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [AuthModule, NewsModule, DatabaseModule, SharedModule],
})
export class AppModule {}
