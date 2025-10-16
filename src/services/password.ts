import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// scrypt is callback based, so we convert it in promis with the line below
const scryptAsync = promisify(scrypt);

export class Password {
  // static funtions not need to make instance of the class in order to execute them
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword
  }
}