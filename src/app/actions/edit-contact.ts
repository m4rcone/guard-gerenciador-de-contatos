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

  const response = await fetch(
    `http://localhost:3000/api/contacts/${validatedFields.data.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...validatedFields.data, id: undefined }),
    },
  );

  const responseBody = await response.json();

  if (response.status !== 200) {
    return { message: responseBody.message };
  }

  return { success: true };
}
