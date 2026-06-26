import { Controller, Get } from '@nestjs/common';
import { PdfService } from './pdf.service';

@Controller()
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get()
  getData() {
    return this.pdfService.getData();
  }
}
