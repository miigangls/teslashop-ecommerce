import { API_ENDPOINTS, NEXT_API_URL } from "@/modules/common/constants";

export async function uploadProductImage(file: File): Promise<{ fileName: string }> {
  const url = `${NEXT_API_URL}${API_ENDPOINTS.filesProduct}`;
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const fallbackMessage = `Upload failed with status ${response.status}`;
    const payload = await response.json().catch(() => ({ message: fallbackMessage }));
    throw new Error(payload?.message ?? fallbackMessage);
  }

  return response.json() as Promise<{ fileName: string }>;
}
