import { Test } from '@nestjs/testing';
import { PdfService } from './pdf.service';

describe('PdfService', () => {
  let service: PdfService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [PdfService],
    }).compile();

    service = app.get<PdfService>(PdfService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
