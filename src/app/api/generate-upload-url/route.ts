import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import r2Client from "app/lib/r2-client";
import { generateUniqueFileName } from "app/utils/generate-unique-filename";
import controller from "infra/controller";
import { ValidationError } from "infra/errors";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("file");
    const contentType = searchParams.get("type");

    if (!fileName || !contentType) {
      const validationError = new ValidationError({});

      return NextResponse.json(validationError.toJSON, {
        status: validationError.statusCode,
      });
    }

    const uniqueFileName = generateUniqueFileName(fileName);

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET!,
      Key: uniqueFileName,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 }); // 1 MIN

    return NextResponse.json(
      { url: signedUrl, uniqueFileName: uniqueFileName },
      { status: 200 },
    );
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}
