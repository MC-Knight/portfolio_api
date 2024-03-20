import dotenv from "dotenv";

dotenv.config();

function getPort(): number {
  if (process.env.PORT !== undefined) {
    return parseInt(process.env.PORT);
  }

  return 7000;
}

export { getPort };
