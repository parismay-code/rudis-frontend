import { z } from 'zod';
import { GameSchema } from '~entities/games';

export const RoomSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  game: GameSchema,
  maxPlayers: z.number().nullable(),
  owner: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const RoomDtoSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  gameId: z.number(),
  password: z.string().min(4, 'Минимальная длина пароля - 4 символа').max(20, 'Максимальная длина пароля - 20 символов').nullable(),
  maxPlayers: z.number().nullable(),
});

export const JoinRoomDtoSchema = z.object({
  roomId: z.number(),
  password: z.string(),
});