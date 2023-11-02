import {
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
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
    try {
      await this.authService.registerUser(payload);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        throw new InternalServerErrorException('Something went wrong...');
      } else {
        throw error;
      }
    }
  }

  @Post('/login')
  async loginUser(@Body() payload: LoginUserDto) {
    try {
      const result = await this.authService.loginUser(payload);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        throw new InternalServerErrorException('Something went wrong...');
      } else {
        throw error;
      }
    }
  }

  @Post('/update-tokens')
  async updateTokens(@Body() payload: UpdateTokenDto) {
    try {
      const result = await this.authService.updateTokens(payload);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        throw new InternalServerErrorException('Something went wrong...');
      } else {
        throw error;
      }
    }
  }
}
