import { Injectable } from '@nestjs/common';

@Injectable()
export class PdfService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
