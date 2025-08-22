import { FormState, AddContactFormSchema } from "app/lib/definitions";
import { uploadToStorage } from "./upload-to-storage";

export async function addContact(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = AddContactFormSchema.safeParse({
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

  const response = await fetch("/api/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  });

  const responseBody = await response.json();

  if (response.status !== 201) {
    return { message: responseBody.message };
  }

  return { success: true };
}
