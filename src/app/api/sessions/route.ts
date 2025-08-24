import controller from "infra/controller";
import authentication from "models/authentication";
import session from "models/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const userInputValues = await request.json();

    const authenticatedUser = await authentication.getAuthenticatedUser(
      userInputValues.email,
      userInputValues.password,
    );

    const newSession = await session.create(authenticatedUser.id);

    const response = NextResponse.json(newSession, { status: 201 });

    controller.setSessionCookie(newSession.token, response);

    return response;
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session_id")?.value;

    const sessionObject = await session.findOneValidByToken(sessionToken);
    const expiredSession = await session.expire(sessionObject.id);

    const response = NextResponse.json(expiredSession, { status: 200 });

    controller.clearSessionCookie(response);

    return response;
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}
