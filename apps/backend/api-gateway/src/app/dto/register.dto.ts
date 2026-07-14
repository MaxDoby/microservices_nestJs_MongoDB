import { registerRequestSchema } from '@financial-tracker/contracts';
import { createZodDto } from 'nestjs-zod';

export class RegisterDto extends createZodDto(registerRequestSchema) {}
