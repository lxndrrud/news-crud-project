import { Module } from '@nestjs/common';
import { AuthModule } from './logic/auth/auth.module';
import { NewsModule } from './logic/news/news.module';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    NewsModule,
    DatabaseModule,
    SharedModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN },
    }),
  ],
})
export class AppModule {}
