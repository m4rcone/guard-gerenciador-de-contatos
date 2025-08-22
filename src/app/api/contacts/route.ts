import controller from "infra/controller";
import contact from "models/contact";
import session from "models/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session_id")?.value;

    const sessionObject = await session.findOneValidByToken(sessionToken);
    const renewedSessionObject = await session.renew(sessionObject.id);

    const contactInputValues = await request.json();

    const newContact = await contact.create({
      ...contactInputValues,
      user_id: sessionObject.user_id,
    });

    const response = NextResponse.json(newContact, { status: 201 });

    controller.setSessionCookie(renewedSessionObject.token, response);

    return response;
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}
