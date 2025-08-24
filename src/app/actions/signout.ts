export async function signout() {
  const response = await fetch("/api/sessions", {
    method: "DELETE",
  });

  const responseBody = await response.json();

  if (response.status !== 200) {
    return { message: responseBody.message };
  }

  return { success: true };
}
