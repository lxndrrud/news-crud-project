import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class EditNewsItemDto {
  @IsNotEmpty()
  @IsNumber()
  newsItemId: number;

  @IsOptional()
  @MaxLength(80)
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  text?: string;
}
