import { hash, compare } from 'bcrypt';

export async function hashedPasword(password): Promise<string> {
  return await hash(password, 10);
}

export async function comparedPassword(
  encodePassword,
  inputPassword,
): Promise<Boolean> {
  return await compare(inputPassword, encodePassword);
}
