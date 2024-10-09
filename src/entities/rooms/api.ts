import { z } from 'zod';
import { baseUrl } from '~shared/api';
import { createJsonMutation, createJsonQuery } from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { RoomSchema } from './contracts';
import { RoomDto } from './types';

export async function getAllRoomsQuery(signal?: AbortSignal) {
  return createJsonQuery({
    request: {
      url: baseUrl('/rooms'),
      method: 'GET',
    },
    response: {
      contract: zodContract(RoomSchema.array()),
    },
    abort: signal,
  });
}

export async function getRoomQuery(roomId: number, signal?: AbortSignal) {
  return createJsonQuery({
    request: {
      url: baseUrl(`/rooms/${roomId}`),
      method: 'GET',
    },
    response: {
      contract: zodContract(RoomSchema),
    },
    abort: signal,
  });
}

export async function createRoomMutation(params: { room: RoomDto }) {
  return createJsonMutation({
    request: {
      url: baseUrl('/rooms'),
      method: 'POST',
      body: JSON.stringify(params.room),
    },
    response: {
      contract: zodContract(RoomSchema),
    },
  });
}

export async function updateRoomMutation(params: {
  roomId: number;
  room: RoomDto;
}) {
  return createJsonMutation({
    request: {
      url: baseUrl(`/rooms/${params.roomId}`),
      method: 'PUT',
      body: JSON.stringify(params.room),
    },
    response: {
      contract: zodContract(RoomSchema),
    },
  });
}

export async function deleteRoomMutation(params: { roomId: number }) {
  return createJsonMutation({
    request: {
      url: baseUrl(`/rooms/${params.roomId}`),
      method: 'DELETE',
    },
    response: {
      contract: zodContract(z.any()),
    },
  });
}