import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AUTH_SERVICE, IAuthService } from './auth-service/auth-service';
import { RegisterUserDto } from './dto/RegisterUser.dto';
import { LoginUserRequestDto } from './dto/LoginUserRequest.dto';
import { UpdateTokensRequestDto } from './dto/UpdateTokensRequest.dto';
import { UpdateTokensResponseDto } from './dto/UpdateTokensResponse.dto';
import { LoginUserResponseDto } from './dto/LoginUserResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: IAuthService,
  ) {}

  @Post('/register')
  async registerUser(@Body() payload: RegisterUserDto) {
    await this.authService.registerUser(payload);
  }

  @Post('/login')
  async loginUser(@Body() payload: LoginUserRequestDto) {
    const result = await this.authService.loginUser(payload);
    const preparedResult = new LoginUserResponseDto(
      result.access,
      result.refresh,
    );
    return preparedResult;
  }

  @Post('/update-tokens')
  async updateTokens(@Body() payload: UpdateTokensRequestDto) {
    const result = await this.authService.updateTokens(payload);
    const preparedResult = new UpdateTokensResponseDto(
      result.access,
      result.refresh,
    );
    return preparedResult;
  }
}
