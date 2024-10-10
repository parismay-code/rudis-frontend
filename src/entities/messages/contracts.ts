import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.number(),
  text: z.string(),
  user: z.object({
    id: z.number(),
    login: z.string(),
    avatar: z.string().nullable(),
  }),
  reply: z.object({
    id: z.number(),
  }).nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const MessageDtoSchema = z.object({
  text: z.string(),
  roomId: z.number(),
  replyId: z.number().nullable(),
});