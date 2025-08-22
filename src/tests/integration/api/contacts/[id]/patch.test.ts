import { randomUUID } from "node:crypto";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
});

describe("PATCH /api/contacts/:id", () => {
  describe("Authenticated user", () => {
    test("With existent 'id'", async () => {
      const newUser = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "nome",
          email: "existent-id@email.com",
          password: "senha",
        }),
      });

      expect(newUser.status).toBe(201);

      const newUserResponseBody = await newUser.json();

      const sessionObject = await orchestrator.createSession(
        newUserResponseBody.id,
      );

      const newContact = await fetch("http://localhost:3000/api/contacts", {
        method: "POST",
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          name: "contato",
          phone: "+5551999999999",
          email: "contato@email.com",
        }),
      });

      expect(newContact.status).toBe(201);

      const newContactResponseBody = await newContact.json();

      const response = await fetch(
        `http://localhost:3000/api/contacts/${newContactResponseBody.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            name: "nome atualizado",
            phone: "+5551888888888",
            email: "email-atualizado@email.com",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        user_id: newUserResponseBody.id,
        name: "nome atualizado",
        phone: "+5551888888888",
        email: "email-atualizado@email.com",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With non-existent 'id'", async () => {
      const newUser = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "nome",
          email: "non-existent-id@email.com",
          password: "senha",
        }),
      });

      const newUserResponseBody = await newUser.json();

      const sessionObject = await orchestrator.createSession(
        newUserResponseBody.id,
      );

      const response = await fetch(
        `http://localhost:3000/api/contacts/${randomUUID()}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            name: "nome atualizado",
            phone: "+5551888888888",
            email: "email-atualizado@email.com",
          }),
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
          method: "PATCH",
          headers: {
            Cookie: `session_id=${nonexistentToken}`,
          },
          body: JSON.stringify({}),
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
