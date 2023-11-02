import * as Joi from 'joi';

export const TokenPayloadSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .error(new Error('There is an error while checking token payload!')),
});
