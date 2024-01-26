import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto extends PickType(CreateArticleDto, ['title', 'markdown']) {
  @ApiProperty({ description: '文档id' })
  id: number
}
