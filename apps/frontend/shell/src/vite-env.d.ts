/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_MF_URL: string;
  readonly VITE_FINANCIAL_MF_URL: string;
  readonly VITE_REPORTS_MF_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
