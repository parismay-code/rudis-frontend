import { z } from 'zod';

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
});

export const RoleDtoSchema = z.object({
  name: z.string(),
  description: z.string(),
});