import controller from "infra/controller";
import authentication from "models/authentication";
import session from "models/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const userInputValues = await request.json();

  try {
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
