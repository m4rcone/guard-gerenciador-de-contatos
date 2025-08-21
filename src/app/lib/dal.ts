import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import session from "models/session";

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
