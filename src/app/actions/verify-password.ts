import { FormState } from "app/lib/definitions";

export async function verifyPassword(_state: FormState, formData: FormData) {
  const providedPassword = formData.get("password").toString();

  const response = await fetch("/api/verify-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: providedPassword,
    }),
  });

  if (response.status !== 200) {
    const responseBody = await response.json();

    return { message: responseBody.message };
  }

  return { success: true };
}
