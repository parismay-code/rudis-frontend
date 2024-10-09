import { z } from 'zod';
import { BanUserDtoSchema, SetUserGameDtoSchema, SetUserRoleDtoSchema, UserDtoSchema, UserSchema } from './contracts';

export type User = z.infer<typeof UserSchema>;
export type UserDto = z.infer<typeof UserDtoSchema>;
export type SetUserGameDto = z.infer<typeof SetUserGameDtoSchema>;
export type SetUserRoleDto = z.infer<typeof SetUserRoleDtoSchema>;
export type BanUserDto = z.infer<typeof BanUserDtoSchema>;