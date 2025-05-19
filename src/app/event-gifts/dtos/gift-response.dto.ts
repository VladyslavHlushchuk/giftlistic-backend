import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO для відображення одного подарунка.
 */
export class GiftResponseDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  purchaseLink: string | null;

  @ApiProperty({ nullable: true })
  imageUrl: string | null;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ nullable: true })
  price: number | null;

  @ApiProperty()
  selected: boolean;

  @ApiProperty({ nullable: true, description: 'Імʼя дарувальника' })
  giftGiver: string | null;

  static fromEntity(entity: any): GiftResponseDTO {
    const dto = new GiftResponseDTO();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.purchaseLink = entity.purchaseLink ?? null;
    dto.imageUrl = entity.imageUrl ?? null;
    dto.description = entity.description ?? null;
    dto.price = entity.price ?? null;
    dto.selected = entity.selected ?? false;
    dto.giftGiver = entity.giftGiver?.name ?? null;
    return dto;
  }
}
