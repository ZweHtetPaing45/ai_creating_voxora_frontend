export interface ApiErrorBody { message?: string }

export interface User { id: number; email: string; name?: string }
export interface RegisterRequest { name: string; email: string; password: string }
export interface LoginRequest { email: string; password: string }
export interface LoginResponse {
  message: string;
  token: { user: User; token: string };
}
export interface RegisterResponse { message: string; result: User }

export interface DocumentPage {
  pageId: number;
  documentId: number;
  document_name: string;
  pageNumber: number;
  content: string | null;
  imageUrl: string | null;
  deleteId: string | null;
  audio_path: string | null;
}

export interface DocumentPagesResponse { message?: string; result: DocumentPage[] }
export interface UploadResponse {
  message: string;
  result: {
    document_id: number;
    title: string;
    file_name: string;
    file_path: string;
    total_pages: number;
    pages: Array<{
      page_number: number;
      content: string | null;
      pdf_image_url: string | null;
      pdf_delete_id: string | null;
    }>;
  };
}

export interface MutationResponse { success: boolean; message?: string; data?: unknown }
export interface VoiceResponse {
  result: {
    success: boolean;
    message: string;
    data: { folderName: string; total: number; pages: Array<{ fileName: string; audioUrl: string }> };
  };
}
