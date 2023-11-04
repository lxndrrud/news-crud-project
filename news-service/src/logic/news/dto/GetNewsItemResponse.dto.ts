export class GetNewsItemResponseDto {
  constructor(
    public id: number,
    public title: string,
    public text: string,
    public createdAt: Date,
    public updatedAt: Date | null,
    public author: string,
  ) {}
}
