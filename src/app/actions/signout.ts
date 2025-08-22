export async function signout() {
  const response = await fetch("http://localhost:3000/api/sessions", {
    method: "DELETE",
  });

  console.log(response.status);

  const responseBody = await response.json();

  if (response.status !== 200) {
    return { message: responseBody.message };
  }

  return { success: true };
}
