import { hash, compare } from 'bcrypt';

export async function hashedPasword(password: string): Promise<string> {
  return await hash(password, 10);
}

export async function comparedPassword(
  encodePassword: string,
  inputPassword: string,
): Promise<Boolean> {
  return await compare(inputPassword, encodePassword);
}
