import { useMutation } from '@tanstack/react-query';
import { queryClient, ReactQueryService } from '~shared/lib/react-query';
import {
  addUserGameMutation,
  addUserRoleMutation,
  banUserMutation,
  createUserMutation,
  deleteUserMutation,
  getAllUsersQuery,
  getUserQuery,
  removeUserGameMutation,
  removeUserRoleMutation,
  unbanUserMutation,
  updateUserMutation,
} from './api';
import { BanUserDto, SetUserGameDto, SetUserRoleDto, UserDto } from './types';

const keys = {
  root: () => ['user'] as const,
  getAll: () => [...keys.root(), 'all'] as const,
  getOne: (id: number) => [...keys.root(), 'get', id.toString()] as const,
  create: () => [...keys.root(), 'create'] as const,
  update: () => [...keys.root(), 'update'] as const,
  delete: () => [...keys.root(), 'delete'] as const,
  addRole: () => [...keys.root(), 'addRole'] as const,
  removeRole: () => [...keys.root(), 'removeRole'] as const,
  addGame: () => [...keys.root(), 'addGame'] as const,
  removeGame: () => [...keys.root(), 'removeGame'] as const,
  ban: () => [...keys.root(), 'ban'] as const,
  unban: () => [...keys.root(), 'unban'] as const,
};

export const allUsersService = new ReactQueryService(keys.getAll, getAllUsersQuery);

export const userService = new ReactQueryService((id: number) => keys.getOne(id), getUserQuery);

export function useCreateUserMutation() {
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: (data: UserDto) => createUserMutation(data),
    onSuccess: async (user) => {
      userService.setCache(user.id, user);

      await queryClient.invalidateQueries({ queryKey: keys.getAll() });
    },
  });
}

export function useUpdateUserMutation() {
  return useMutation({
    mutationKey: keys.update(),
    mutationFn: (params: { id: number, data: UserDto }) => updateUserMutation(params),
    onSuccess: async (user) => {
      userService.setCache(user.id, user);

      await queryClient.invalidateQueries({ queryKey: keys.getAll() });
    },
  });
}

export function useDeleteUserMutation() {
  return useMutation({
    mutationKey: keys.delete(),
    mutationFn: (id: number) => deleteUserMutation(id),
    onSuccess: async (user) => {
      userService.removeCache(user.id);

      await queryClient.invalidateQueries({ queryKey: keys.getAll() });
    },
  });
}

export function useAddUserRoleMutation() {
  return useMutation({
    mutationKey: keys.addRole(),
    mutationFn: (data: SetUserRoleDto) => addUserRoleMutation(data),
    onSuccess: async (user) => {
      userService.setCache(user.id, user);

      await queryClient.invalidateQueries({ queryKey: keys.getAll() });
    },
  });
}

export function useRemoveUserRoleMutation() {
  return useMutation({
    mutationKey: keys.removeRole(),
    mutationFn: (data: SetUserRoleDto) => removeUserRoleMutation(data),
    onSuccess: async (user) => {
      userService.setCache(user.id, user);

      await queryClient.invalidateQueries({ queryKey: keys.getAll() });
    },
  });
}

export function useAddUserGameMutation() {
  return useMutation({
    mutationKey: keys.addGame(),
    mutationFn: (data: SetUserGameDto) => addUserGameMutation(data),
    onSuccess: async (user) => {
      userService.setCache(user.id, user);

      await queryClient.invalidateQueries({ queryKey: keys.getAll() });
    },
  });
}

export function useRemoveUserGameMutation() {
  return useMutation({
    mutationKey: keys.removeGame(),
    mutationFn: (data: SetUserGameDto) => removeUserGameMutation(data),
    onSuccess: async (user) => {
      userService.setCache(user.id, user);

      await queryClient.invalidateQueries({ queryKey: keys.getAll() });
    },
  });
}

export function useBanUserMutation() {
  return useMutation({
    mutationKey: keys.ban(),
    mutationFn: (data: BanUserDto) => banUserMutation(data),
    onSuccess: async (user) => {
      userService.setCache(user.id, user);

      await queryClient.invalidateQueries({ queryKey: keys.getAll() });
    },
  });
}

export function useUnbanUserMutation() {
  return useMutation({
    mutationKey: keys.unban(),
    mutationFn: (id: number) => unbanUserMutation(id),
    onSuccess: async (user) => {
      userService.setCache(user.id, user);

      await queryClient.invalidateQueries({ queryKey: keys.getAll() });
    },
  });
}