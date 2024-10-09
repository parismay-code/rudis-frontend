import { z } from 'zod';
import { RoleDtoSchema, RoleSchema } from './contracts';

export type Role = z.infer<typeof RoleSchema>
export type RoleDto = z.infer<typeof RoleDtoSchema>