import controller from "infra/controller";
import password from "models/password";
import session from "models/session";
import user from "models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session_id")?.value;

    const sessionObject = await session.findOneValidByToken(sessionToken);
    const renewedSessionObject = await session.renew(sessionObject.id);

    const { password: providedPassword } = await request.json();

    const userFound = await user.findOneById(sessionObject.user_id);

    const isValid = await password.compare(
      providedPassword,
      userFound.password,
    );

    if (!isValid) {
      return NextResponse.json(
        { message: "Por favor, insira uma senha válida." },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ success: true }, { status: 200 });

    controller.setSessionCookie(renewedSessionObject.token, response);

    return response;
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}
