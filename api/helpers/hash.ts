import { hashSync, compareSync } from "bcryptjs";

export const generate = (password: string): string => {
  return hashSync(password);
};

export const decode = (password: string, hash: string): boolean => {
  return compareSync(password, hash);
};
