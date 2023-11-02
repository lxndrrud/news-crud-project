import { IsJWT, IsNotEmpty } from 'class-validator';

export class UpdateTokenDto {
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
