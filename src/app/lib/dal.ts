import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import session from "models/session";
import user from "models/user";
import contact from "models/contact";

export const verifySession = cache(async () => {
  const sessionToken = (await cookies()).get("session_id")?.value;

  let sessionObjectValid;

  try {
    sessionObjectValid = await session.findOneValidByToken(sessionToken);
  } catch (error) {
    console.log(error.message);
  }

  if (!sessionObjectValid) {
    redirect("/signin");
  }

  return { isAuth: true, userId: sessionObjectValid.user_id };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  const userFound = await user.findOneById(session.userId);

  return { ...userFound, password: undefined };
});

export const getUserContacts = cache(async () => {
  const session = await verifySession();
  const contactsFounded = await contact.findManyByUserId(session.userId);

  return contactsFounded;
});
