import { FormState, SigninFormSchema } from "app/lib/definitions";

export async function signin(_state: FormState, formData: FormData) {
  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const response = await fetch("/api/sessions", {
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
