import { useMutation } from '@tanstack/react-query';
import { queryClient, ReactQueryService } from '~shared/lib/react-query';
import {
  attachRoleMutation,
  createRoleMutation,
  deleteRoleMutation,
  detachRoleMutation,
  getAllRolesQuery,
  getRoleQuery,
  updateRoleMutation,
} from './api';

const keys = {
  root: () => ['role'] as const,
  getAll: () => [...keys.root(), 'all'] as const,
  get: (roleId: number) => [...keys.root(), 'get', roleId.toString()] as const,
  create: () => [...keys.root(), 'create'] as const,
  update: (roleId: number) => [...keys.root(), 'update', roleId.toString()] as const,
  delete: (roleId: number) => [...keys.root(), 'delete', roleId.toString()] as const,
  attach: (roleId: number, userId: number) =>
    [...keys.root(), 'attach', roleId.toString(), userId.toString()] as const,
  detach: (roleId: number, userId: number) =>
    [...keys.root(), 'detach', roleId.toString(), userId.toString()] as const,
};

export const allRolesService = new ReactQueryService(keys.getAll, getAllRolesQuery);

export const roleService = new ReactQueryService((roleId: number) => keys.get(roleId), getRoleQuery);

export function useCreateRoleMutation() {
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: createRoleMutation,
    onSuccess: async (role) => {
      roleService.setCache(role.id, role);
    },
  });
}

export function useUpdateRoleMutation(roleId: number) {
  return useMutation({
    mutationKey: keys.update(roleId),
    mutationFn: updateRoleMutation,
    onSuccess: async (role) => {
      roleService.setCache(roleId, role);
    },
  });
}

export function useDeleteRoleMutation(roleId: number) {
  return useMutation({
    mutationKey: keys.delete(roleId),
    mutationFn: deleteRoleMutation,
    onSuccess: async () => {
      roleService.removeCache(roleId);

      await queryClient.invalidateQueries();
    },
  });
}

export function useAttachRoleMutation(roleId: number, userId: number) {
  return useMutation({
    mutationKey: keys.attach(roleId, userId),
    mutationFn: attachRoleMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });
}

export function useDetachRoleMutation(roleId: number, userId: number) {
  return useMutation({
    mutationKey: keys.detach(roleId, userId),
    mutationFn: detachRoleMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });
}