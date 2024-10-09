import { z } from 'zod';
import { RoomDtoSchema, RoomSchema } from './contracts';

export type Room = z.infer<typeof RoomSchema>
export type RoomDto = z.infer<typeof RoomDtoSchema>