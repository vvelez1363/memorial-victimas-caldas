// services/fileUploadService.ts

const FILE_UPLOAD_URL = "/api/files/upload";

export async function uploadFile(
  file: File,
  authToken?: string,
): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);

  const headers: HeadersInit = {};
  // Cuando tengas auth, descomenta:
  // if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

  const response = await fetch(FILE_UPLOAD_URL, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error al subir archivo: ${response.status}`);
  }

  const data = await response.json();

  // Cubre los nombres de campo más comunes que usan los backends
  return data.url ?? data.fileUrl ?? data.path ?? data.secure_url ?? null;
}
