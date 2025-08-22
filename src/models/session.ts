import database from "infra/database";
import { UnauthorizedError } from "infra/errors";
import crypto from "node:crypto";

const EXPIRATION_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 30; // 30 Days

async function create(userId: string) {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);
  const newSession = await insertQuery(token, userId, expiresAt);

  return newSession;

  async function insertQuery(token: string, userId: string, expiresAt: Date) {
    const result = await database.query({
      text: `
        INSERT INTO
          sessions (id, token, user_id, expires_at)
        VALUES
          ($1, $2, $3, $4)
        RETURNING
          *
      `,
      values: [crypto.randomUUID(), token, userId, expiresAt],
    });

    return result.rows[0];
  }
}

async function findOneValidByToken(sessionToken: string) {
  const sessionFound = await selectQuery(sessionToken);

  return sessionFound;

  async function selectQuery(sessionToken: string) {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          sessions
        WHERE
          token = $1
          AND expires_at > NOW()
        LIMIT
          1
      `,
      values: [sessionToken],
    });

    if (result.rowCount === 0) {
      throw new UnauthorizedError({
        message: "O usuário não possui sessão ativa.",
        action: "Verifique se o usuário está logado e tente novamente.",
      });
    }

    return result.rows[0];
  }
}

async function renew(sessionId: string) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);
  const renewedSession = await runUpdateQuery(sessionId, expiresAt);

  return renewedSession;

  async function runUpdateQuery(sessionId: string, expiresAt: Date) {
    const result = await database.query({
      text: `
        UPDATE
          sessions
        SET
          expires_at = $2,
          updated_at = timezone('UTC', NOW())
        WHERE
          id = $1
        RETURNING
          *
      `,
      values: [sessionId, expiresAt],
    });

    return result.rows[0];
  }
}

async function expire(sessionId: string) {
  const expiredSession = await runUpdateQuery(sessionId);

  return expiredSession;

  async function runUpdateQuery(sessionId: string) {
    const result = await database.query({
      text: `
        UPDATE
          sessions
        SET
          expires_at = created_at - interval '1 day',
          updated_at = timezone('UTC', NOW())
        WHERE
          id = $1
        RETURNING
          *
      `,
      values: [sessionId],
    });

    return result.rows[0];
  }
}

const session = {
  create,
  findOneValidByToken,
  renew,
  expire,
  EXPIRATION_IN_MILLISECONDS,
};

export default session;
