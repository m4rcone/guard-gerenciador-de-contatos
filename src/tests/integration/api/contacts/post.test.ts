import session from "models/session";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
});

describe("POST /api/contacts", () => {
  test("With valid session", async () => {
    const newUser = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "nome",
        email: "nome@email.com",
        password: "senha",
      }),
    });

    const newUserResponseBody = await newUser.json();

    const sessionObject = await orchestrator.createSession(
      newUserResponseBody.id,
    );

    const response = await fetch("http://localhost:3000/api/contacts", {
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

    expect(response.status).toBe(201);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      id: responseBody.id,
      user_id: newUserResponseBody.id,
      name: "contato",
      phone: "+5551999999999",
      email: "contato@email.com",
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });
  });

  test("With non-existent session", async () => {
    const nonexistentToken =
      "0ba39e01897bb08920784c9c29c990bfd84e158d51ff93e93f327275559e0f4306cc39bcf2275bc70cb158057730050b";

    const response = await fetch("http://localhost:3000/api/contacts", {
      method: "POST",
      headers: {
        Cookie: `session_id=${nonexistentToken}`,
      },
      body: JSON.stringify({
        name: "contato",
        phone: "+5551999999999",
        email: "contato@email.com",
      }),
    });

    expect(response.status).toBe(401);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "UnauthorizedError",
      message: "O usuário não possui sessão ativa.",
      action: "Verifique se o usuário está logado e tente novamente.",
      status_code: 401,
    });
  });

  test("With expired session", async () => {
    jest.useFakeTimers({
      now: new Date(Date.now() - session.EXPIRATION_IN_MILLISECONDS),
    });

    const newUser = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "/json",
      },
      body: JSON.stringify({
        name: "nome",
        email: "nome2@email.com",
        password: "senha",
      }),
    });

    const newUserResponseBody = await newUser.json();

    const sessionObject = await orchestrator.createSession(
      newUserResponseBody.id,
    );

    jest.useRealTimers();

    const response = await fetch("http://localhost:3000/api/contacts", {
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
