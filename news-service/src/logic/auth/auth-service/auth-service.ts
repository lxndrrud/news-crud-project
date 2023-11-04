import { Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../dto/RegisterUser.dto';
import { LoginUserRequestDto } from '../dto/LoginUserRequest.dto';
import { AUTH_REPO } from '../auth-repo/auth-repo';
import { UTILS_HASHER } from '../../../shared/utils/hasher/hasher';
import { UTILS_JWT_HELPER } from '../../../shared/utils/jwt-helper/jwt-helper';
import { UpdateTokensRequestDto } from '../dto/UpdateTokensRequest.dto';
import { InternalError } from '../../../shared/errors/InternalError';
import { InvalidRequestError } from '../../../shared/errors/InvalidRequestError';
import { User } from '../../../database/entities/User.entity';

// Identifier for Dependency Injection
export const AUTH_SERVICE = 'AUTH_SERVICE';

// In-module dependency interface (Clean Architecture)
interface IDepAuthRepo {
  getUserByEmail(email: string): Promise<User | null>;
  createUser(payload: RegisterUserDto): Promise<void>;
}

// In-module dependency interface (Clean Architecture)
interface IDepJwtHelper {
  signToken(
    payload: {
      email: string;
    },
    expiresIn: string | number | undefined,
  ): Promise<string>;

  verifyAndGetPayload(token: string): Promise<{
    email: string;
  }>;
}

interface IDepHasher {
  hash(payload: string): Promise<string>;
  compare(raw: string, hashed: string): Promise<boolean>;
}

// Service interface for flexible refactoring
export interface IAuthService {
  registerUser(payload: RegisterUserDto): Promise<void>;
  loginUser(payload: LoginUserRequestDto): Promise<{
    access: string;
    refresh: string;
  }>;
  updateTokens(payload: UpdateTokensRequestDto): Promise<{
    access: string;
    refresh: string;
  }>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(AUTH_REPO) private readonly authRepo: IDepAuthRepo,
    @Inject(UTILS_JWT_HELPER) private readonly jwtHelper: IDepJwtHelper,
    @Inject(UTILS_HASHER) private readonly hasher: IDepHasher,
  ) {}

  async registerUser(payload: RegisterUserDto) {
    if (payload.password !== payload.passwordConfirmation)
      throw new InvalidRequestError(
        'Password and its confirmation are not equal.',
      );

    const user = await this.authRepo.getUserByEmail(payload.email);
    if (user) throw new InternalError('User with this email already exists!');

    const hashedDto = new RegisterUserDto();
    hashedDto.email = payload.email;
    hashedDto.password = await this.hasher.hash(payload.password);
    hashedDto.passwordConfirmation = hashedDto.password;

    await this.authRepo.createUser(hashedDto);
  }

  async loginUser(payload: LoginUserRequestDto) {
    const user = await this.authRepo.getUserByEmail(payload.email);
    if (!user)
      throw new InternalError(
        'User with this combination of email and password is not found!',
      );
    const isPasswordValid = await this.hasher.compare(
      payload.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new InternalError(
        'User with this combination of email and password is not found!',
      );
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtHelper.signToken(
        { email: user.email },
        process.env.JWT_ACCESS_EXPIRES_IN as string,
      ),
      this.jwtHelper.signToken(
        { email: user.email },
        process.env.JWT_REFRESH_EXPIRES_IN as string,
      ),
    ]);

    return {
      access: accessToken,
      refresh: refreshToken,
    };
  }

  async updateTokens(payload: UpdateTokensRequestDto) {
    const refreshTokenPayload = await this.jwtHelper.verifyAndGetPayload(
      payload.refreshToken,
    );

    const user = await this.authRepo.getUserByEmail(refreshTokenPayload.email);
    if (!user)
      throw new InternalError('Authorization failed! Try to re-login, please.');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtHelper.signToken(
        { email: user.email },
        process.env.JWT_ACCESS_EXPIRES_IN as string,
      ),
      this.jwtHelper.signToken(
        { email: user.email },
        process.env.JWT_REFRESH_EXPIRES_IN as string,
      ),
    ]);
    return {
      access: accessToken,
      refresh: refreshToken,
    };
  }
}
