import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AUTH_SERVICE, IAuthService } from './auth-service/auth-service';
import { RegisterUserDto } from './dto/RegisterUser.dto';
import { LoginUserDto } from './dto/LoginUser.dto';
import { UpdateTokenDto } from './dto/UpdateTokens.dto';

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
  async loginUser(@Body() payload: LoginUserDto) {
    const result = await this.authService.loginUser(payload);
    return result;
  }

  @Post('/update-tokens')
  async updateTokens(@Body() payload: UpdateTokenDto) {
    const result = await this.authService.updateTokens(payload);
    return result;
  }
}
