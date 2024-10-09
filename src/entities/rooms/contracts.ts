import { z } from 'zod';
import { MessageSchema } from '~entities/messages';

export const RoomSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  owner: z.number(),
  messages: MessageSchema.array(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const RoomDtoSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  password: z.string().min(4, 'Минимальная длина пароля - 4 символа').max(20, 'Максимальная длина пароля - 20 символов').nullable(),
});