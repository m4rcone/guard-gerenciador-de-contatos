import { FormState, EditContactFormSchema } from "app/lib/definitions";

export async function editContact(_state: FormState, formData: FormData) {
  const validatedFields = EditContactFormSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const avatarFile = formData.get("avatar") as File;
  let avatarUrl: string | FormState;

  if (avatarFile.size > 0) {
    avatarUrl = await uploadToStorage(avatarFile);

    if (typeof avatarUrl !== "string") {
      const errors = avatarUrl;
      return errors;
    }
  }

  const contactData = {
    ...validatedFields.data,
    avatar_url: avatarUrl,
  };

  const response = await fetch(
    `http://localhost:3000/api/contacts/${validatedFields.data.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...contactData, id: undefined }),
    },
  );

  const responseBody = await response.json();

  if (response.status !== 200) {
    return { message: responseBody.message };
  }

  return { success: true };
}

async function uploadToStorage(file: File): Promise<string | FormState> {
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
    `http://localhost:3000/api/generate-upload-url?file=${file.name}&type=${file.type}`,
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
