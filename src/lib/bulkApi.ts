const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/v1/";
const JSON_CONTENT_TYPE = "application/json";

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${JSON.parse(token)}` } : {};
}

export async function bulkDelete(endpoint: string, ids: string[]): Promise<void> {
  const res = await fetch(`${BASE_API_URL}${endpoint}/bulk-delete/`, {
    method: "POST",
    headers: { "Content-Type": JSON_CONTENT_TYPE, ...getAuthHeader() },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error("Bulk delete failed");
}

export async function bulkArchive(endpoint: string, ids: string[]): Promise<void> {
  const res = await fetch(`${BASE_API_URL}${endpoint}/bulk-archive/`, {
    method: "POST",
    headers: { "Content-Type": JSON_CONTENT_TYPE, ...getAuthHeader() },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error("Bulk archive failed");
}

export async function duplicateItem(endpoint: string, id: string): Promise<unknown> {
  const res = await fetch(`${BASE_API_URL}${endpoint}/${id}/duplicate/`, {
    method: "POST",
    headers: { "Content-Type": JSON_CONTENT_TYPE, ...getAuthHeader() },
  });
  if (!res.ok) throw new Error("Duplicate failed");
  return res.json();
}

export async function importFile(
  endpoint: string,
  file: File
): Promise<{ created: number; errors: { row: number; errors: unknown }[] }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${BASE_API_URL}${endpoint}/import/`, {
    method: "POST",
    headers: { ...getAuthHeader() },
    body: fd,
  });
  if (!res.ok) throw new Error("Import failed");
  return res.json();
}

export async function exportFromApi(endpoint: string, ids: string[], format: "csv" | "xlsx"): Promise<Blob> {
  const params = new URLSearchParams({ format });
  ids.forEach((id) => params.append("ids", id));
  const res = await fetch(`${BASE_API_URL}${endpoint}/export/?${params}`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error("Export failed");
  return res.blob();
}
