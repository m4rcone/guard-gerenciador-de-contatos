import orchestrator from "tests/orchestrator";
import session from "models/session";
import setCookieParser from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
});

describe("POST /api/sessions", () => {
  test("With incorrect `email` but correct `password`", async () => {
    await orchestrator.createUser({
      password: "senhacorreta",
    });

    const response = await fetch("http://localhost:3000/api/sessions", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: "email-incorreto@email.com",
        password: "senhacorreta",
      }),
    });

    expect(response.status).toBe(401);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "UnauthorizedError",
      message: "Os dados de autenticação não conferem.",
      action: "Verifique se os dados enviados estão corretos.",
      status_code: 401,
    });
  });

  test("With correct `email` but incorrect `password`", async () => {
    await orchestrator.createUser({
      email: "email-correto@email.com",
    });

    const response = await fetch("http://localhost:3000/api/sessions", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: "email-correto@email.com",
        password: "senhaincorreta",
      }),
    });

    expect(response.status).toBe(401);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "UnauthorizedError",
      message: "Os dados de autenticação não conferem.",
      action: "Verifique se os dados enviados estão corretos.",
      status_code: 401,
    });
  });

  test("With incorrect `email` and incorrect `password`", async () => {
    await orchestrator.createUser();

    const response = await fetch("http://localhost:3000/api/sessions", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: "email-incorreto@email.com",
        password: "senhaincorreta",
      }),
    });

    expect(response.status).toBe(401);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "UnauthorizedError",
      message: "Os dados de autenticação não conferem.",
      action: "Verifique se os dados enviados estão corretos.",
      status_code: 401,
    });
  });

  test("With correct `email` and correct `password`", async () => {
    const newUser = await orchestrator.createUser({
      email: "email-correto2@email.com",
      password: "senhacorreta",
    });

    const response = await fetch("http://localhost:3000/api/sessions", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: "email-correto2@email.com",
        password: "senhacorreta",
      }),
    });

    expect(response.status).toBe(201);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      id: responseBody.id,
      token: responseBody.token,
      expires_at: responseBody.expires_at,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
      user_id: newUser.id,
    });

    const expiredAt = new Date(responseBody.expires_at).setMilliseconds(0);
    const createdAt = new Date(responseBody.created_at).setMilliseconds(0);

    expect(expiredAt - createdAt).toBe(session.EXPIRATION_IN_MILLISECONDS);

    // Set-Cookies
    const parsedSetCookie = setCookieParser(response, {
      map: true,
    });

    expect(parsedSetCookie.session_id).toEqual({
      name: "session_id",
      value: responseBody.token,
      maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
      path: "/",
      httpOnly: true,
    });
  });
});
