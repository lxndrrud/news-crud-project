import { IsNotEmpty } from 'class-validator';

export class UpdateTokenDto {
  @IsNotEmpty()
  refreshToken: string;
}
