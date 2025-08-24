import orchestrator from "tests/orchestrator";
import { success } from "zod";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
});

describe("POST /api/verify-password", () => {
  test("With valid 'password'", async () => {
    const newUser = await orchestrator.createUser({
      password: "senhacorreta",
    });

    const sessionObject = await orchestrator.createSession(newUser.id);

    const response = await fetch("http://localhost:3000/api/verify-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${sessionObject.token}`,
      },
      body: JSON.stringify({
        password: "senhacorreta",
      }),
    });

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toEqual({ success: true });
  });

  test("With invalid 'password'", async () => {
    const newUser = await orchestrator.createUser();

    const sessionObject = await orchestrator.createSession(newUser.id);

    const response = await fetch("http://localhost:3000/api/verify-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${sessionObject.token}`,
      },
      body: JSON.stringify({
        password: "senhaincorreta",
      }),
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      message: "Por favor, insira uma senha válida.",
    });
  });
});
