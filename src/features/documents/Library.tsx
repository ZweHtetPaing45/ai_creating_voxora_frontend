"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api, ApiError } from "../../services/api";
import type { DocumentPage } from "../../types/api";
import { groupDocuments, normalizeOcrContent } from "../../utils/content";
import { Alert, EmptyState, Spinner } from "../../components/Status";

export function Library() {
  const [pages, setPages] = useState<DocumentPage[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [query, setQuery] = useState("");
  const load = () => { setLoading(true); setError(""); api.getAllPages().then(r => setPages(r.result || [])).catch(e => setError(e instanceof ApiError ? e.message : "Couldn’t load your library.")).finally(() => setLoading(false)); };
  useEffect(load, []);
  const docs = useMemo(() => groupDocuments(pages).filter(d => d.name.toLowerCase().includes(query.toLowerCase())), [pages, query]);
  const totalOcr = pages.filter(p => normalizeOcrContent(p.content)).length; const totalAudio = pages.filter(p => p.audio_path).length;
  return <main className="page"><div className="page-heading"><div><p className="eyebrow">YOUR WORKSPACE</p><h1>Document library</h1><p>Extract, edit, and listen—everything starts with a page.</p></div><Link className="button primary" href="/app/upload">＋ Upload PDF</Link></div>
    {error && <Alert>{error} <button className="link-button" onClick={load}>Try again</button></Alert>}
    {loading ? <div className="loading-card"><Spinner label="Loading your documents…" /></div> : pages.length === 0 ? <EmptyState title="Your library is ready" detail="Upload your first PDF to create page images, extract text, and generate audio." action={<Link className="button primary" href="/app/upload">Upload a PDF</Link>} /> : <>
      <section className="stats-grid" aria-label="Library summary"><article><span className="stat-icon purple">▱</span><div><strong>{docs.length}</strong><small>Documents</small></div></article><article><span className="stat-icon green">T</span><div><strong>{totalOcr}</strong><small>Pages with text</small></div></article><article><span className="stat-icon amber">♪</span><div><strong>{totalAudio}</strong><small>Audio pages</small></div></article></section>
      <section className="library-section"><div className="section-toolbar"><div><h2>Recent documents</h2><p>{docs.length} {docs.length === 1 ? "document" : "documents"}</p></div><label className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search documents" aria-label="Search documents" /></label></div>
      {docs.length === 0 ? <EmptyState title="No matches" detail="Try a different document name." /> : <div className="document-grid">{docs.map(doc => { const processed = doc.pages.filter(p => normalizeOcrContent(p.content)).length; const audio = doc.pages.filter(p => p.audio_path).length; return <Link className="document-card" href={`/app/documents/${doc.id}`} key={doc.id}><div className="doc-preview">{doc.pages[0]?.imageUrl ? <img src={doc.pages[0].imageUrl} alt="" /> : <span>PDF</span>}<i>{doc.pages.length} pages</i></div><div className="doc-card-body"><h3>{doc.name}</h3><p>{processed ? `${processed} of ${doc.pages.length} pages processed` : "Ready for OCR"}</p><div className="progress"><span style={{width: `${doc.pages.length ? processed/doc.pages.length*100 : 0}%`}} /></div><div className="doc-meta"><span className={processed ? "badge success" : "badge"}>{processed ? "Text ready" : "Uploaded"}</span>{audio > 0 && <span>♪ {audio}</span>}<b>Open →</b></div></div></Link>; })}</div>}
      </section></>}
  </main>;
}
