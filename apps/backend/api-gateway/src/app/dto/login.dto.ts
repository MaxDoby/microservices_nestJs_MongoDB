import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email of an existing registered user.',
    example: 'max@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Password for the provided email.',
    example: 'secret123',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
