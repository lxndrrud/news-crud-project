import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../dto/RegisterUser.dto';
import { LoginUserDto } from '../dto/LoginUser.dto';
import { AUTH_REPO, IAuthRepo } from '../auth-repo/auth-repo';
import { IHasher, UTILS_HASHER } from 'src/shared/utils/hasher/hasher';
import { IJwtHelper, JWT_HELPER } from '../jwt-helper/jwt-helper';
import { LoginError } from '../errors/LoginError';
import { UpdateTokenDto } from '../dto/UpdateTokens.dto';

export const AUTH_SERVICE = 'AUTH_SERVICE';

export interface IAuthService {
  registerUser(payload: RegisterUserDto): Promise<void>;
  loginUser(payload: LoginUserDto): Promise<{
    access: string;
    refresh: string;
  }>;
  updateTokens(payload: UpdateTokenDto): Promise<{
    access: string;
    refresh: string;
  }>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(AUTH_REPO) private readonly authRepo: IAuthRepo,
    @Inject(JWT_HELPER) private readonly jwtHelper: IJwtHelper,
    @Inject(UTILS_HASHER) private readonly hasher: IHasher,
  ) {}

  async registerUser(payload: RegisterUserDto) {
    if (payload.password !== payload.passwordConfirmation)
      throw new BadRequestException(
        'Password and its confirmation are not equal.',
      );

    const hashedDto = new RegisterUserDto();
    hashedDto.email = payload.email;
    hashedDto.password = await this.hasher.hash(payload.password);
    hashedDto.passwordConfirmation = hashedDto.password;

    await this.authRepo.createUser(hashedDto);
  }

  async loginUser(payload: LoginUserDto) {
    const user = await this.authRepo.getUserByEmail(payload.email);
    if (!user)
      throw new LoginError(
        'User with this combination of email and password is not found!',
      );
    const isPasswordValid = await this.hasher.compare(
      payload.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new LoginError(
        'User with this combination of email and password is not found!',
      );
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtHelper.signAccessToken({ email: user.email }),
      this.jwtHelper.signRefreshToken({ email: user.email }),
    ]);

    return {
      access: accessToken,
      refresh: refreshToken,
    };
  }

  async updateTokens(payload: UpdateTokenDto) {
    const refreshTokenPayload = await this.jwtHelper.verifyAndGetPayload(
      payload.refreshToken,
    );

    const user = await this.authRepo.getUserByEmail(refreshTokenPayload.email);
    if (!user)
      throw new LoginError('Authorization failed! Try to re-login, please.');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtHelper.signAccessToken({ email: user.email }),
      this.jwtHelper.signRefreshToken({ email: user.email }),
    ]);
    return {
      access: accessToken,
      refresh: refreshToken,
    };
  }
}
