import bycriptjs from "bcryptjs";

async function hash(password: string) {
  const rounds = getNumberOfRounds();

  return await bycriptjs.hash(password, rounds);
}

async function compare(providedPassword: string, storedPassword: string) {
  return await bycriptjs.compare(providedPassword, storedPassword);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

const password = {
  hash,
  compare,
};

export default password;
