import { FormState } from "app/lib/definitions";

/**
 * Faz o upload de um arquivo de imagem para o storage configurado via Cloudflare.
 *
 * Fluxo:
 * 1. Valida o tipo e tamanho do arquivo.
 * 2. Solicita ao backend uma URL de upload assinada (presigned URL).
 * 3. Envia o arquivo diretamente para o storage usando a URL gerada.
 * 4. Retorna a URL pública final do arquivo ou um objeto de erro.
 *
 * @param {File} file - Arquivo selecionado pelo usuário (apenas JPEG ou PNG são aceitos).
 *
 * @returns {Promise<string | FormState>}
 * - `string`: a URL pública do arquivo armazenado em caso de sucesso.
 * - `FormState`: objeto contendo mensagens de erro de validação ou falha de upload.
 */

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
