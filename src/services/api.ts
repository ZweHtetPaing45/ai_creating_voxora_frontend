import type {
  DocumentPage, DocumentPagesResponse, LoginRequest, LoginResponse, MutationResponse,
  RegisterRequest, RegisterResponse, UploadResponse, VoiceResponse,
} from "../types/api";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || "http://104.156.254.236:5000/api/v1").replace(/\/$/, "");
const TOKEN_KEY = "pdfchangeai_token";
const USER_KEY = "pdfchangeai_user";

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

async function request<T>(path: string, init: RequestInit = {}, authenticated = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (authenticated && typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError("We couldn’t reach the service. Check your connection and try again.", 0);
  }
  const body = await response.json().catch(() => ({})) as { message?: string };
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") clearSession();
    throw new ApiError(body.message || "Something went wrong. Please try again.", response.status);
  }
  return body as T;
}

export function saveSession(response: LoginResponse) {
  localStorage.setItem(TOKEN_KEY, response.token.token);
  localStorage.setItem(USER_KEY, JSON.stringify(response.token.user));
}
export function clearSession() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }
export function hasSession() { return typeof window !== "undefined" && Boolean(localStorage.getItem(TOKEN_KEY)); }
export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(USER_KEY) || "null") as { id: number; email: string } | null; } catch { return null; }
}

export const api = {
  register: (data: RegisterRequest) => request<RegisterResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) }, false),
  login: (data: LoginRequest) => request<LoginResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }, false),
  getAllPages: () => request<DocumentPagesResponse>("/document_page"),
  getDocumentPages: (documentId: number) => request<DocumentPagesResponse>(`/document_page/${documentId}`),
  uploadDocument: (title: string, file: File) => {
    const form = new FormData(); form.append("pdf", file); form.append("title", title);
    return request<UploadResponse>("/pdf/upload", { method: "POST", body: form });
  },
  updateContent: (pageId: number, content: string) => request<MutationResponse>(`/document_page/${pageId}`, { method: "PATCH", body: JSON.stringify({ content }) }),
  processDocumentOcr: (documentId: number) => request<MutationResponse>(`/ocr/${documentId}/process`, { method: "POST", body: JSON.stringify({}) }),
  processSelectedOcr: (pages: DocumentPage[]) => request<MutationResponse>("/ocr/process", { method: "POST", body: JSON.stringify({ pages: pages.map(p => ({ pageId: p.pageId, pageNumber: p.pageNumber, imageUrl: p.imageUrl })) }) }),
  generateVoice: (documentId: number, pageNumbers: number[]) => request<VoiceResponse>(`/voice/generate/${documentId}`, { method: "POST", body: JSON.stringify({ page_number: pageNumbers }) }),
};
