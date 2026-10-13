export function normalizeOcrContent(value: string | null): string {
  if (!value) return "";
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every(item => typeof item === "string") ? parsed.join("\n") : value;
  } catch { return value; }
}

export function groupDocuments(pages: import("../types/api").DocumentPage[]) {
  const grouped = new Map<number, import("../types/api").DocumentPage[]>();
  pages.forEach(page => grouped.set(page.documentId, [...(grouped.get(page.documentId) || []), page]));
  return [...grouped.entries()].map(([id, items]) => ({ id, name: items[0]?.document_name || `Document ${id}`, pages: items.sort((a,b) => a.pageNumber-b.pageNumber) }));
}
