import { z } from 'zod';
import { SetUserRoleDtoSchema, UserDtoSchema, UserSchema } from './contracts';

export type User = z.infer<typeof UserSchema>;
export type UserDto = z.infer<typeof UserDtoSchema>;
export type SetUserRoleDto = z.infer<typeof SetUserRoleDtoSchema>;