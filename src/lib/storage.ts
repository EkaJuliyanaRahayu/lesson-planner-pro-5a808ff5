import { DocumentRecord } from "./types";

const STORAGE_KEY = "pembelajaran-documents";

export function getDocuments(): DocumentRecord[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveDocument(doc: DocumentRecord) {
  const docs = getDocuments();
  const idx = docs.findIndex((d) => d.id === doc.id);
  if (idx >= 0) {
    docs[idx] = doc;
  } else {
    docs.push(doc);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function deleteDocument(id: string) {
  const docs = getDocuments().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}
