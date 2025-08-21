import { NextResponse } from "next/server";
import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./errors";
import { serialize } from "cookie";
import session from "models/session";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function errorHandlerResponse(error: Error | any) {
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError
  ) {
    return NextResponse.json(error, { status: error.statusCode });
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });

  console.error(publicErrorObject);

  return NextResponse.json(publicErrorObject, {
    status: publicErrorObject.statusCode,
  });
}

function setSessionCookie(sessionToken: string, response: NextResponse) {
  const setCookie = serialize("session_id", sessionToken, {
    path: "/",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  response.headers.set("Set-Cookie", setCookie);
}

const controller = {
  errorHandlerResponse,
  setSessionCookie,
};

export default controller;
