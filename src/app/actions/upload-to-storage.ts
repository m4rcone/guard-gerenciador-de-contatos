import { FormState } from "app/lib/definitions";

export async function uploadToStorage(file: File): Promise<string | FormState> {
  const allowedTypes = ["image/jpeg", "image/png"];
  const maxFileSize = 1024 * 1024 * 5; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      errors: {
        avatar: ["Não permitido. Use JPEG, JPG ou PNG."],
      },
    };
  }

  if (file.size > maxFileSize) {
    return {
      errors: {
        avatar: ["Arquivo muito grande. Máximo 5MB."],
      },
    };
  }

  const response = await fetch(
    `/api/generate-upload-url?file=${file.name}&type=${file.type}`,
  );

  const { url, uniqueFileName } = await response.json();

  if (!url) {
    return { message: "Falha no upload da imagem." };
  }

  const uploadResponse = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    return { message: "Falha no upload da imagem." };
  }

  return `${process.env.NEXT_PUBLIC_CLOUDFLARE_PUBLIC_URL}/${uniqueFileName}`;
}
