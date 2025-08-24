import controller from "infra/controller";
import password from "models/password";
import user from "models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const userInputValues = await request.json();
    const newUser = await user.create(userInputValues);

    return NextResponse.json(
      { ...newUser, password: undefined },
      { status: 201 },
    );
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}
