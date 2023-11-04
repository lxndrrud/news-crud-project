import { createStubInstance } from 'sinon';
import { AuthService } from './auth-service';
import { AuthRepo } from '../auth-repo/auth-repo';
import { Hasher } from '../../../shared/utils/hasher/hasher';
import { JwtHelper } from '../../../shared/utils/jwt-helper/jwt-helper';
import { RegisterUserDto } from '../dto/RegisterUser.dto';

describe('AuthService', () => {
  describe('Register user', () => {
    it('OK', async () => {
      const repoMock = createStubInstance(AuthRepo);
      repoMock.getUserByEmail.resolves(null);
      repoMock.createUser.resolves(undefined);
      const jwtHelperMock = createStubInstance(JwtHelper);
      const hasherMock = createStubInstance(Hasher);
      hasherMock.hash.resolves('hash');
      // const testModule = await Test.createTestingModule({
      //   providers: [
      //     { provide: AUTH_REPO, useFactory: () => repoMock },
      //     { provide: UTILS_JWT_HELPER, useFactory: () => jwtHelperMock },
      //     { provide: UTILS_HASHER, useFactory: () => hasherMock },
      //     { provide: 'service', useClass: AuthService },
      //   ],
      // }).compile();
      // const service = testModule.get<AuthService>('service');
      const service = new AuthService(repoMock, jwtHelperMock, hasherMock);

      const dto = new RegisterUserDto();
      dto.email = 'test@ya.ru';
      dto.password = 'test';
      dto.passwordConfirmation = 'test';
      await service.registerUser(dto);
      expect(repoMock.getUserByEmail.callCount).toEqual(1);
      expect(repoMock.createUser.callCount).toEqual(1);
      expect(hasherMock.hash.callCount).toEqual(1);
    });
  });
});
