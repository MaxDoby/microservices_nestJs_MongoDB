import { refreshTokenRequestSchema } from '@financial-tracker/contracts';
import { createZodDto } from 'nestjs-zod';

export class RefreshTokenDto extends createZodDto(refreshTokenRequestSchema) {}
