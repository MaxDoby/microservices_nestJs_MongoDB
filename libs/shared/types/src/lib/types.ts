export type EntityId = string;

export type PdfHttpResponse = {
  setHeader(name: string, value: string): void;
  send(body: Buffer): void;
};
