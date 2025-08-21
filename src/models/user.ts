import database from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors";
import password from "models/password";
import { randomUUID } from "node:crypto";

export type UserInputValues = {
  name: string;
  email: string;
  password: string;
};

async function findOneById(id: string) {
  const userFound = await runSelectQuery(id);

  return userFound;

  async function runSelectQuery(id: string) {
    const result = await database.query({
      text: `
        SELECT 
          *
        FROM 
          users
        WHERE
          id = $1
        LIMIT
          1
        ;`,
      values: [id],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "O id informado não foi encontrado no sistema.",
        action: "Verifique o id informado e tente novamente.",
      });
    }

    return result.rows[0];
  }
}

async function findOneByEmail(email: string) {
  const userFound = await runSelectQuery(email);

  return userFound;

  async function runSelectQuery(email: string) {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM 
          users
        WHERE
          LOWER(email) = LOWER($1)
        LIMIT
          1
        ;`,
      values: [email],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "O email informado não foi encontrado no sistema.",
        action: "Verifique o email informado e tente novamente.",
      });
    }

    return result.rows[0];
  }
}

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
  findOneById,
  findOneByEmail,
  create,
};

export default user;
