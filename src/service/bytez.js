import Bytez from "bytez.js";

export const sdk = new Bytez(
  process.env.BYTEZ_API_KEY,
  process.env.NODE_ENV === "development"
);
