import orchestrator from "tests/orchestrator";
import session from "models/session";
import setCookieParser from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
});

describe("DELETE /api/sessions", () => {
  test("With non-existent session`", async () => {
    const nonexistentToken =
      "0ba39e01897bb08920784c9c29c990bfd84e158d51ff93e93f327275559e0f4306cc39bcf2275bc70cb158057730050b";

    const response = await fetch("http://localhost:3000/api/sessions", {
      method: "DELETE",
      headers: {
        Cookie: `session_id=${nonexistentToken}`,
      },
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

    const newUser = await orchestrator.createUser();

    const sessionObject = await orchestrator.createSession(newUser.id);

    jest.useRealTimers();

    const response = await fetch("http://localhost:3000/api/sessions", {
      method: "DELETE",
      headers: {
        Cookie: `session_id=${sessionObject.token}`,
      },
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

  test("With valid session", async () => {
    const newUser = await orchestrator.createUser();

    const sessionObject = await orchestrator.createSession(newUser.id);

    const response = await fetch("http://localhost:3000/api/sessions", {
      method: "DELETE",
      headers: {
        Cookie: `session_id=${sessionObject.token}`,
      },
    });

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      id: sessionObject.id,
      token: sessionObject.token,
      expires_at: responseBody.expires_at,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
      user_id: sessionObject.user_id,
    });

    expect(
      responseBody.expires_at < sessionObject.expires_at.toISOString(),
    ).toBe(true);
    expect(
      responseBody.updated_at > sessionObject.updated_at.toISOString(),
    ).toBe(true);

    // Set-Cookies
    const parsedSetCookie = setCookieParser(response, {
      map: true,
    });

    expect(parsedSetCookie.session_id).toEqual({
      name: "session_id",
      value: "invalid",
      maxAge: -1,
      path: "/",
      httpOnly: true,
    });
  });
});
