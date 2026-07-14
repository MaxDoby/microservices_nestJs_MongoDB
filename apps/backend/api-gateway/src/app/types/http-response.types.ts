export type PdfHttpResponse = {
  setHeader(name: string, value: string): void;
  send(body: Buffer): void;
};
