import { validateTokenRequestSchema } from '@financial-tracker/contracts';
import { createZodDto } from 'nestjs-zod';

export class ValidateTokenDto extends createZodDto(validateTokenRequestSchema) {}
