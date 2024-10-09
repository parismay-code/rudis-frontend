import { z } from 'zod';
import { JwtTokenSchema, LoginUserDtoSchema, RegisterUserDtoSchema } from './contracts';

export type LoginUserDto = z.infer<typeof LoginUserDtoSchema>;
export type RegisterUserDto = z.infer<typeof RegisterUserDtoSchema>;
export type JwtToken = z.infer<typeof JwtTokenSchema>;