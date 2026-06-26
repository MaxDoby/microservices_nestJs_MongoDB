import { Test, TestingModule } from '@nestjs/testing';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';

describe('PdfController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PdfController],
      providers: [PdfService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const pdfController = app.get<PdfController>(PdfController);

      expect(pdfController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
