import { z } from 'zod';
import { errorResponseSchema } from './error.schemas';

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
