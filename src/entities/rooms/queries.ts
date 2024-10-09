import { useMutation } from '@tanstack/react-query';
import { queryClient, ReactQueryService } from '~shared/lib/react-query';
import { createRoomMutation, deleteRoomMutation, getAllRoomsQuery, getRoomQuery, updateRoomMutation } from './api';
import { RoomDto } from './types';

const keys = {
  root: () => ['room'] as const,
  getAll: () => [...keys.root(), 'all'] as const,
  get: (roomId: number) => [...keys.root(), 'get', roomId.toString()] as const,
  create: () => [...keys.root(), 'create'] as const,
  update: () => [...keys.root(), 'update'] as const,
  delete: () => [...keys.root(), 'delete'] as const,
};

export const allRoomsService = new ReactQueryService(keys.getAll, getAllRoomsQuery);

export const roomService = new ReactQueryService((roomId: number) => keys.get(roomId), getRoomQuery);

export function useCreateRoomMutation() {
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: (room: RoomDto) => createRoomMutation({ room }),
    onSuccess: async (room) => {
      roomService.setCache(room.id, room);

      await queryClient.invalidateQueries({ queryKey: keys.getAll() });
    },
  });
}

export function useUpdateRoomMutation(roomId: number) {
  return useMutation({
    mutationKey: keys.update(),
    mutationFn: (room: RoomDto) => updateRoomMutation({ roomId, room }),
    onSuccess: async (room) => {
      roomService.setCache(roomId, room);

      await queryClient.invalidateQueries({ queryKey: keys.getAll() });
    },
  });
}

export function useDeleteRoomMutation(roomId: number) {
  return useMutation({
    mutationKey: keys.delete(),
    mutationFn: () => deleteRoomMutation({ roomId }),
    onSuccess: async () => {
      roomService.removeCache(roomId);

      await queryClient.invalidateQueries({ queryKey: keys.getAll() });
    },
  });
}