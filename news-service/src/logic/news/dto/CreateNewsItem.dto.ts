import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateNewsItemDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  title: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}
