import database from "infra/database";
import { randomUUID } from "node:crypto";

type ContactInputValues = {
  name: string;
  phone?: string;
  email?: string;
  userId: string;
};

async function create(contactInputValues: ContactInputValues) {
  const newContact = await runInsertQuery(contactInputValues);

  return newContact;

  async function runInsertQuery(contactInputValues: ContactInputValues) {
    const result = await database.query({
      text: `
        INSERT INTO
          contacts(id, name, phone, email, user_id)
        VALUES
          ($1, $2, $3, $4, $5)
        RETURNING
          *
      `,
      values: [
        randomUUID(),
        contactInputValues.name,
        contactInputValues.phone,
        contactInputValues.email,
        contactInputValues.userId,
      ],
    });

    return result.rows[0];
  }
}

const contact = {
  create,
};

export default contact;
