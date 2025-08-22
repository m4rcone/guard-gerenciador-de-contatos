import { FormState, EditContactFormSchema } from "app/lib/definitions";
import { uploadToStorage } from "./upload-to-storage";

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

  const response = await fetch(`/api/contacts/${validatedFields.data.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...contactData, id: undefined }),
  });

  const responseBody = await response.json();

  if (response.status !== 200) {
    return { message: responseBody.message };
  }

  return { success: true };
}
