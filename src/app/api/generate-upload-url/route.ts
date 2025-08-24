import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import r2Client from "app/lib/r2-client";
import { generateUniqueFileName } from "app/utils/generate-unique-filename";
import controller from "infra/controller";
import { ValidationError } from "infra/errors";
import session from "models/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Validation
    const { searchParams } = new URL(request.url);

    const fileName = searchParams.get("file");
    const contentType = searchParams.get("type");

    if (!fileName || !contentType) {
      const validationError = new ValidationError({});

      return NextResponse.json(validationError.toJSON, {
        status: validationError.statusCode,
      });
    }

    // Authorization
    const sessionToken = request.cookies.get("session_id")?.value;

    const sessionObject = await session.findOneValidByToken(sessionToken);
    const renewedSessionObject = await session.renew(sessionObject.id);

    // Signed Url
    const uniqueFileName = generateUniqueFileName(fileName);

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET!,
      Key: uniqueFileName,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 }); // 1 MIN

    const responseBody = { url: signedUrl, uniqueFileName: uniqueFileName };

    const response = NextResponse.json(responseBody, { status: 200 });

    controller.setSessionCookie(renewedSessionObject.token, response);

    return response;
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}
