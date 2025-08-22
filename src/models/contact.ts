import database from "infra/database";
import { NotFoundError } from "infra/errors";
import { randomUUID } from "node:crypto";

type ContactInputValues = {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  user_id?: string;
  avatar_url?: string;
};

async function create(contactInputValues: ContactInputValues) {
  const newContact = await runInsertQuery(contactInputValues);

  return newContact;

  async function runInsertQuery(contactInputValues: ContactInputValues) {
    const result = await database.query({
      text: `
        INSERT INTO
          contacts(id, name, phone, email, user_id, avatar_url)
        VALUES
          ($1, $2, $3, $4, $5, $6)
        RETURNING
          *
      `,
      values: [
        randomUUID(),
        contactInputValues.name,
        contactInputValues.phone,
        contactInputValues.email,
        contactInputValues.user_id,
        contactInputValues.avatar_url,
      ],
    });

    return result.rows[0];
  }
}

async function update(
  contactId: string,
  contactInputValues: ContactInputValues,
) {
  const currentContact = await findOneById(contactId);

  const contactWithNewValues = { ...currentContact, ...contactInputValues };

  const updatedContact = await runUpdateQuery(contactWithNewValues);

  return updatedContact;

  async function runUpdateQuery(contactWithNewValues: ContactInputValues) {
    const result = await database.query({
      text: `
        UPDATE
          contacts
        SET
          name = $1,
          phone = $2,
          email = $3,
          updated_at = timezone('UTC', now()),
          user_id = $4,
          avatar_url = $5
        WHERE
          id = $6
        RETURNING
          *
      `,
      values: [
        contactWithNewValues.name,
        contactWithNewValues.phone,
        contactWithNewValues.email,
        contactWithNewValues.user_id,
        contactWithNewValues.avatar_url,
        contactWithNewValues.id,
      ],
    });

    return result.rows[0];
  }
}

async function remove(contactId: string) {
  await findOneById(contactId);
  await runDeleteQuery(contactId);

  async function runDeleteQuery(contactId: string) {
    await database.query({
      text: `
        DELETE FROM
          contacts
        WHERE
          id = $1
      `,
      values: [contactId],
    });
  }
}

async function findOneById(contactId: string) {
  const contactFound = await runSelectQuery(contactId);

  return contactFound;

  async function runSelectQuery(contactId: string) {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          contacts
        WHERE
          id = $1
      `,
      values: [contactId],
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

async function findManyByUserId(userId: string) {
  const contactsFound = await runSelectQuery(userId);

  return contactsFound;

  async function runSelectQuery(userId: string) {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          contacts
        WHERE
          user_id = $1
        ORDER BY
          name
      `,
      values: [userId],
    });

    return result.rows;
  }
}

const contact = {
  create,
  update,
  remove,
  findManyByUserId,
};

export default contact;
