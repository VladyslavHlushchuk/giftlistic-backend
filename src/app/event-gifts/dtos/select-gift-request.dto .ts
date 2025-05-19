import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * DTO для вибору подарунку гостем.
 */
export class SelectGiftRequestDTO {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'Унікальний ідентифікатор подарунку',
    example: 'a0f70813-849e-48f5-9f76-5b0c5b99429d',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  giftId: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'Унікальний ідентифікатор користувача, який обирає подарунок',
    example: 'd1c1ee7c-83c2-4d17-9ec2-96fbb734d578',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  giftGiverId: string;
}
