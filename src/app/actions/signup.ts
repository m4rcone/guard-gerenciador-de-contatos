import { FormState, SignupFormSchema } from "app/lib/definitions";

export async function signup(_state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    repeat: formData.get("repeat"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const response = await fetch("http://localhost:3000/api/users", {
    method: "POST",
    body: JSON.stringify({ ...validatedFields.data, repeat: undefined }),
  });

  const responseBody = await response.json();

  if (response.status !== 201) {
    return { message: responseBody.message };
  }

  return { success: true };
}
