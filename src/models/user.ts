import database from "infra/database";
import { ValidationError } from "infra/errors";
import password from "models/password";
import { randomUUID } from "node:crypto";

export type UserInputValues = {
  name: string;
  email: string;
  password: string;
};

async function create(userInputValues: UserInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);

  return newUser;

  async function runInsertQuery(userInputValues: UserInputValues) {
    const result = await database.query({
      text: `
        INSERT INTO 
          users (id, name, email, password) 
        VALUES 
          ($1, $2, $3, $4)
        RETURNING
          *
        ;`,
      values: [
        randomUUID(),
        userInputValues.name,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return result.rows[0];
  }
}

async function validateUniqueEmail(email: string) {
  const result = await database.query({
    text: `
      SELECT 
        email
      FROM 
        users
      WHERE
        LOWER(email) = LOWER($1)
      ;`,
    values: [email],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "O email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar a operação.",
    });
  }
}

async function hashPasswordInObject(userInputValues: UserInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

const user = {
  create,
};

export default user;
