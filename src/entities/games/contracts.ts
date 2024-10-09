import { z } from 'zod';

export const GameRoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  maxPlayers: z.number().nullable(),
});

export const GameSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  minPlayers: z.number(),
  maxPlayers: z.number(),
  roles: GameRoleSchema.array(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const GameRoleDtoSchema = z.object({
  name: z.string(),
  description: z.string(),
  maxPlayers: z.number().nullable(),
  gameId: z.number(),
});

export const GameDtoSchema = z.object({
  name: z.string(),
  description: z.string(),
  minPlayers: z.number().min(2, 'Минимальное количество нижнего порога игроков - 2').max(8, 'Максимально количество нижнего порога игроков - 8'),
  maxPlayers: z.number().min(3, 'Минимальное количество верхнего порога игроков - 3').max(20, 'Максимальное количество верхнего порога игроков - 20'),
  roles: GameRoleDtoSchema.array(),
});