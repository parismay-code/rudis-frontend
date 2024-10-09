import { z } from 'zod';
import { RoleSchema } from '~entities/roles';

export const UserSchema = z.object({
  id: z.number(),
  login: z.string(),
  email: z.string().email(),
  banned: z.boolean(),
  banReason: z.string().nullable(),
  roles: RoleSchema.array(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UserDtoSchema = z.object({
  login: z.optional(z.string().max(28)),
  email: z.optional(z.string()),
  password: z.optional(z.string().min(8)),
});

export const SetUserRoleDtoSchema = z.object({
  userId: z.number(),
  roleId: z.number(),
});