import { FormState, AddContactFormSchema } from "app/lib/definitions";

export async function addContact(_state: FormState, formData: FormData) {
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

  const response = await fetch("http://localhost:3000/api/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedFields.data),
  });

  const responseBody = await response.json();

  if (response.status !== 201) {
    return { message: responseBody.message };
  }

  return { success: true };
}
