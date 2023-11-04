import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteNewsItemDto {
  @IsNotEmpty()
  @IsNumber()
  newsItemId: number;
}
