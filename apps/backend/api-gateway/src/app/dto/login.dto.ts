import { loginRequestSchema } from '@financial-tracker/contracts';
import { createZodDto } from 'nestjs-zod';

export class LoginDto extends createZodDto(loginRequestSchema) {}
