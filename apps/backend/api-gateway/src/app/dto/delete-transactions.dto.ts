import { ArrayNotEmpty, IsArray, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteTransactionsDto {
  @ApiProperty({
    description: 'Transaction ids selected by the user for deletion.',
    example: ['6a42891dde452d8eb08ec154'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  transactionIds!: string[];
}
