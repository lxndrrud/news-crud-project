import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AUTH_SERVICE, AuthService } from './auth-service/auth-service';
import { AUTH_REPO, AuthRepo } from './auth-repo/auth-repo';
import { DatabaseModule } from 'src/database/database.module';
import { SharedModule } from 'src/shared/shared.module';
import { JWT_HELPER, JwtHelper } from 'src/shared/utils/jwt-helper/jwt-helper';
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
      provide: JWT_HELPER,
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
