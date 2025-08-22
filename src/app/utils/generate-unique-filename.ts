import { basename, extname } from "node:path";

export function generateUniqueFileName(fileName: string) {
  const fileExtension = extname(fileName);
  const fileNameWithoutExtension = basename(fileName, fileExtension);
  const cleanedFileName = fileNameWithoutExtension.replace(/[^a-zA-Z0-9]/g, "");
  const cleanedFileNameWithExtension = cleanedFileName.concat(fileExtension);
  const uniqueFileName = `${Date.now()}-${cleanedFileNameWithExtension}`;

  return uniqueFileName;
}
