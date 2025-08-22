import controller from "infra/controller";
import contact from "models/contact";
import session from "models/session";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sessionToken = request.cookies.get("session_id")?.value;

    const sessionObject = await session.findOneValidByToken(sessionToken);
    const renewedSessionObject = await session.renew(sessionObject.id);

    const { id } = await params;
    const contactInputValues = await request.json();

    const updatedContact = await contact.update(id, contactInputValues);

    const response = NextResponse.json(updatedContact, { status: 200 });

    controller.setSessionCookie(renewedSessionObject.token, response);

    return response;
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sessionToken = request.cookies.get("session_id")?.value;

    const sessionObject = await session.findOneValidByToken(sessionToken);
    const renewedSessionObject = await session.renew(sessionObject.id);

    const { id } = await params;

    await contact.remove(id);

    const response = new NextResponse(null, { status: 204 });

    controller.setSessionCookie(renewedSessionObject.token, response);

    return response;
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}
