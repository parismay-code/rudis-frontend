import { z } from 'zod';
import { MessageDtoSchema, MessageSchema } from './contracts';

export type Message = z.infer<typeof MessageSchema>
export type MessageDto = z.infer<typeof MessageDtoSchema>