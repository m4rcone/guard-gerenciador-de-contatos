import { FormState } from "app/lib/definitions";

export async function deleteContact(_state: FormState, formData: FormData) {
  const contactId = formData.get("id").toString();

  const response = await fetch(`/api/contacts/${contactId}`, {
    method: "DELETE",
  });

  if (response.status !== 204) {
    const responseBody = await response.json();

    return { message: responseBody.message };
  }

  return { success: true };
}
