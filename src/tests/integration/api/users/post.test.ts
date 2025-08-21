import password from "models/password";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
});

describe("POST /api/users", () => {
  test("With unique and valid data", async () => {
    const response = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "applications/json",
      },
      body: JSON.stringify({
        name: "nome",
        email: "nome@email.com",
        password: "senha",
      }),
    });

    expect(response.status).toBe(201);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      id: responseBody.id,
      name: "nome",
      email: "nome@email.com",
      password: responseBody.password,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });

    const correctPassword = await password.compare(
      "senha",
      responseBody.password
    );
    const incorrectPassword = await password.compare(
      "senha-incorreta",
      responseBody.password
    );

    expect(correctPassword).toBe(true);
    expect(incorrectPassword).toBe(false);
  });

  test("With duplicated 'email'", async () => {
    const response1 = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: "name",
        email: "emailduplicado@email.com",
        password: "senha",
      }),
    });

    expect(response1.status).toBe(201);

    const response2 = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: "name",
        email: "emailduplicado@email.com",
        password: "senha",
      }),
    });

    const response2Body = await response2.json();

    expect(response2.status).toBe(400);

    expect(response2Body).toEqual({
      name: "ValidationError",
      message: "O email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar a operação.",
      status_code: 400,
    });
  });
});
