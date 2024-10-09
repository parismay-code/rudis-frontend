import { z } from 'zod';
import { JoinRoomDtoSchema, RoomDtoSchema, RoomSchema } from './contracts';

export type Room = z.infer<typeof RoomSchema>
export type RoomDto = z.infer<typeof RoomDtoSchema>
export type JoinRoomDto = z.infer<typeof JoinRoomDtoSchema>