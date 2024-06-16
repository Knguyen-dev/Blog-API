/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_ROLE_ADMIN: string;
  VITE_ROLE_EDITOR: string;
  VITE_ROLE_USER: string;
  VITE_TINYMCE_API_KEY: string;
  VITE_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}