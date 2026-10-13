"use client";
import Link from "next/link";
import { DragEvent, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "../../services/api";
import { Alert, Spinner } from "../../components/Status";

const MAX_SIZE = 100 * 1024 * 1024;
export function UploadDocument() {
  const router = useRouter(); const input = useRef<HTMLInputElement>(null); const [file, setFile] = useState<File | null>(null); const [title, setTitle] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const [dragging, setDragging] = useState(false);
  const choose = (next?: File) => { setError(""); if (!next) return; if (next.type !== "application/pdf" && !next.name.toLowerCase().endsWith(".pdf")) return setError("Choose a PDF file."); if (next.size > MAX_SIZE) return setError("This PDF is larger than the 50 MB upload limit."); setFile(next); if (!title) setTitle(next.name.replace(/\.pdf$/i, "")); };
  const drop = (e: DragEvent) => { e.preventDefault(); setDragging(false); choose(e.dataTransfer.files[0]); };
  const submit = async (e: FormEvent) => { e.preventDefault(); if (!file) return setError("Choose a PDF to upload."); if (!title.trim()) return setError("Give your document a title."); setLoading(true); setError(""); try { const result = await api.uploadDocument(title.trim(), file); router.push(`/app/documents/${result.result.document_id}?uploaded=1`); } catch (reason) { setError(reason instanceof ApiError ? reason.message : "Upload failed. Please try again."); setLoading(false); } };
  return <main className="page narrow-page"><Link className="back-link" href="/app">← Back to library</Link><div className="page-heading compact"><div><p className="eyebrow">NEW DOCUMENT</p><h1>Upload a PDF</h1><p>We’ll turn every page into an image, ready for text extraction.</p></div></div>
    <form className="upload-panel" onSubmit={submit}>{error && <Alert>{error}</Alert>}<button type="button" className={`dropzone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`} onClick={() => input.current?.click()} onDragOver={e => {e.preventDefault();setDragging(true)}} onDragLeave={() => setDragging(false)} onDrop={drop} disabled={loading}>
      <input ref={input} type="file" accept="application/pdf,.pdf" hidden onChange={e => choose(e.target.files?.[0])} />
      {file ? <><span className="file-icon">PDF</span><strong>{file.name}</strong><small>{(file.size/1024/1024).toFixed(1)} MB · Click to replace</small></> : <><span className="upload-icon">⇧</span><strong>Drop your PDF here</strong><span>or click to browse your device</span><small>PDF only · Maximum 50 MB</small></>}
    </button><label>Document title<input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Research notes" disabled={loading} maxLength={160} /></label><div className="upload-note"><span>✦</span><p><strong>What happens next?</strong><br/>Your PDF is securely uploaded and separated into page images. You decide when to run OCR or create audio.</p></div><div className="form-actions"><Link className="button secondary" href="/app">Cancel</Link><button className="button primary" disabled={loading}>{loading ? <Spinner label="Preparing pages…" /> : "Upload and continue →"}</button></div></form>
  </main>;
}
