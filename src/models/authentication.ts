import user from "models/user";
import password from "models/password";
import { NotFoundError, UnauthorizedError } from "infra/errors";

async function getAuthenticatedUser(
  providedEmail: string,
  providedPassword: string
) {
  try {
    const storedUser = await user.findOneByEmail(providedEmail);
    const correctPasswordMatch = await password.compare(
      providedPassword,
      storedUser.password
    );

    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Os dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }

    return storedUser;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new UnauthorizedError({
        message: "Os dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }

    throw error;
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
