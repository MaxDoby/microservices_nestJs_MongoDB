import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User first name displayed in the application.',
    example: 'Max',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'User surname displayed in the application.',
    example: 'Dobinda',
  })
  @IsString()
  @IsNotEmpty()
  surname!: string;

  @ApiProperty({
    description: 'Unique email used for login and account identification.',
    example: 'max@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Plain password received from the client before hashing.',
    minLength: 8,
    example: 'Secret123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number.',
  })
  password!: string;
}
