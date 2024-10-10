import { z } from 'zod';
import { RoleSchema } from '~entities/roles';

export const UserSchema = z.object({
  id: z.number(),
  login: z.string(),
  avatar: z.string().nullable(),
  roles: RoleSchema.array(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UserDtoSchema = z.object({
  login: z.optional(z.string().max(28)),
  password: z.optional(z.string().min(8)),
});

export const SetUserRoleDtoSchema = z.object({
  userId: z.number(),
  roleId: z.number(),
});