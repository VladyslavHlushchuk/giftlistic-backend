import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * DTO для вибору подарунку гостем.
 */
export class SelectGiftRequestDTO {
  @ApiProperty({
    type: String,
    description: 'Унікальний ідентифікатор подарунку',
    example: '524756c3-a956-4cb5-828d-71f3409e5f3d',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  giftId: string;

  @ApiProperty({
    type: String,
    description: 'Унікальний ідентифікатор дарувальника',
    example: '524756c3-a956-4cb5-828d-71f3409e5f3d',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  giftGiverId: string;
}
