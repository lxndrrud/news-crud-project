import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { INewsService, NEWS_SERVICE } from './news-service/news-service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard/jwt-auth-guard';
import { CreateNewsItemDto } from './dto/CreateNewsItem.dto';
import { EditNewsItemDto } from './dto/EditNewsItem.dto';
import { DeleteNewsItemDto } from './dto/DeleteNewsItem.dto';
import { GetNewsItemResponseDto } from './dto/GetNewsItemResponse.dto';

@Controller('news')
export class NewsController {
  constructor(
    @Inject(NEWS_SERVICE) private readonly newsService: INewsService,
  ) {}

  @Get()
  async getVisibleNewsItems() {
    const items = await this.newsService.getVisibleNewsItems();
    const preparedItems = items.map(
      (item) =>
        new GetNewsItemResponseDto(
          item.id,
          item.title,
          item.text,
          item.createdAt,
          item.updatedAt,
          item.author.email,
        ),
    );
    return preparedItems;
  }

  @Get('/:newsItemId')
  async getVisibleNewsItem(@Param('newsItemId') newsItemId: number) {
    const item = await this.newsService.getVisibleNewsItem(newsItemId);
    const preparedItem = new GetNewsItemResponseDto(
      item.id,
      item.title,
      item.text,
      item.createdAt,
      item.updatedAt,
      item.author.email,
    );
    return preparedItem;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createNewsItem(@Body() payload: CreateNewsItemDto, @Req() req: any) {
    await this.newsService.createNewsItem(payload, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateNewsItem(@Body() payload: EditNewsItemDto, @Req() req: any) {
    await this.newsService.editNewsItem(payload, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteNewsItem(@Body() payload: DeleteNewsItemDto, @Req() req: any) {
    await this.newsService.deleteNewsItem(payload, req.user.email);
  }
}
