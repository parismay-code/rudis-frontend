import { z } from 'zod';
import { GameDtoSchema, GameRoleDtoSchema, GameRoleSchema, GameSchema } from './contracts';

export type GameRole = z.infer<typeof GameRoleSchema>
export type Game = z.infer<typeof GameSchema>
export type GameRoleDto = z.infer<typeof GameRoleDtoSchema>
export type GameDto = z.infer<typeof GameDtoSchema>
