import { randomUUID } from "node:crypto";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
});

describe("DELETE /api/contacts/:id", () => {
  describe("Authenticated user", () => {
    test("With existent 'id'", async () => {
      const newUser = await orchestrator.createUser();

      const sessionObject = await orchestrator.createSession(newUser.id);

      const newContactResponse = await fetch(
        "http://localhost:3000/api/contacts",
        {
          method: "POST",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            name: "contato",
            phone: "+5551999999999",
            email: "contato@email.com",
          }),
        },
      );

      expect(newContactResponse.status).toBe(201);

      const newContactResponseBody = await newContactResponse.json();

      const response = await fetch(
        `http://localhost:3000/api/contacts/${newContactResponseBody.id}`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(204);
    });

    test("With non-existent 'id'", async () => {
      const newUser = await orchestrator.createUser();

      const sessionObject = await orchestrator.createSession(newUser.id);

      const response = await fetch(
        `http://localhost:3000/api/contacts/${randomUUID()}`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O id informado não foi encontrado no sistema.",
        action: "Verifique o id informado e tente novamente.",
        status_code: 404,
      });
    });
  });

  describe("Unauthenticated user", () => {
    test("With non-existent token", async () => {
      const nonexistentToken =
        "0ba39e01897bb08920784c9c29c990bfd84e158d51ff93e93f327275559e0f4306cc39bcf2275bc70cb158057730050b";

      const response = await fetch(
        `http://localhost:3000/api/contacts/${randomUUID()}`,
        {
          method: "DELETE",
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
});
