import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AUTH_SERVICE, AuthService } from './auth-service/auth-service';
import { AUTH_REPO, AuthRepo } from './auth-repo/auth-repo';
import { DatabaseModule } from '../../database/database.module';
import { SharedModule } from '../../shared/shared.module';
import {
  UTILS_JWT_HELPER,
  JwtHelper,
} from '../../shared/utils/jwt-helper/jwt-helper';
import { JwtStrategy } from './jwt-strategy/jwt-strategy';

@Module({
  imports: [DatabaseModule, SharedModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: AUTH_REPO,
      useClass: AuthRepo,
    },
    {
      provide: UTILS_JWT_HELPER,
      useClass: JwtHelper,
    },
    JwtStrategy,
  ],
  exports: [
    {
      provide: AUTH_REPO,
      useClass: AuthRepo,
    },
  ],
})
export class AuthModule {}
