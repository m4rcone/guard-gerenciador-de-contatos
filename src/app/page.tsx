import { verifySession } from "./lib/dal";

export default async function Page() {
  const session = await verifySession();

  return <h1>Área logada para o usuário: {session.userId}</h1>;
}
