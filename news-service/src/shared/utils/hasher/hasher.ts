import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

export const UTILS_HASHER = 'UTILS_HASHER';

export interface IHasher {
  hash(payload: string): Promise<string>;
  compare(raw: string, hashed: any): Promise<boolean>;
}

@Injectable()
export class Hasher implements IHasher {
  private readonly salt = 7;

  async hash(payload: string) {
    const hashedPayload = await bcrypt.hash(payload, this.salt);
    return hashedPayload;
  }

  async compare(raw: string, hashed) {
    const result = await bcrypt.compare(raw, hashed);
    return result;
  }
}
