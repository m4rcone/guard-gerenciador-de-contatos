import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
});

describe("GET /api/genetate-upload-url?file&type", () => {
  test("With unauthenticated user", async () => {
    const nonexistentToken =
      "0ba39e01897bb08920784c9c29c990bfd84e158d51ff93e93f327275559e0f4306cc39bcf2275bc70cb158057730050b";

    const response = await fetch(
      "http://localhost:3000/api/generate-upload-url?file=fileName&type=image",
      {
        headers: {
          Cookie: `session_id=${nonexistentToken}`,
        },
      },
    );

    expect(response.status).toBe(401);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "UnauthorizedError",
      message: "O usuário não possui sessão ativa.",
      action: "Verifique se o usuário está logado e tente novamente.",
      status_code: 401,
    });
  });
});
