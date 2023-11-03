import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { TokenPayloadSchema } from '../validation-schemas/TokenPayload.schema';

export const JWT_HELPER = 'JWT_HELPER';

export interface IJwtHelper {
  signAccessToken(payload: { email: string }): Promise<string>;
  signRefreshToken(payload: { email: string }): Promise<string>;
  verifyAndGetPayload(token: string): Promise<{
    email: string;
  }>;
}

@Injectable()
export class JwtHelper implements IJwtHelper {
  async signAccessToken(payload: { email: string }) {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '3m',
    });
  }

  async signRefreshToken(payload: { email: string }) {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '3d',
    });
  }

  async verifyAndGetPayload(token: string) {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    const resultPayload = TokenPayloadSchema.validate(payload, {
      stripUnknown: true,
    });
    if (resultPayload.error) throw resultPayload.error;
    return payload as { email: string };
  }
}
