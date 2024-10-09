import { z } from 'zod';
import { baseUrl } from '~shared/api';
import { createJsonMutation, createJsonQuery } from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { RoleSchema } from './contracts';
import { RoleDto } from './types';

export async function getAllRolesQuery(signal?: AbortSignal) {
  return createJsonQuery({
    request: {
      url: baseUrl('/roles'),
      method: 'GET',
    },
    response: {
      contract: zodContract(RoleSchema.array()),
    },
    abort: signal,
  });
}

export async function getRoleQuery(roleId: number, signal?: AbortSignal) {
  return createJsonQuery({
    request: {
      url: baseUrl(`/roles/${roleId}`),
      method: 'GET',
    },
    response: {
      contract: zodContract(RoleSchema),
    },
    abort: signal,
  });
}

export async function createRoleMutation(params: { role: RoleDto }) {
  return createJsonMutation({
    request: {
      url: baseUrl('/roles'),
      method: 'POST',
      body: JSON.stringify(params.role),
    },
    response: {
      contract: zodContract(RoleSchema),
    },
  });
}

export async function updateRoleMutation(params: {
  roleId: number;
  role: RoleDto;
}) {
  return createJsonMutation({
    request: {
      url: baseUrl(`/roles/${params.roleId}`),
      method: 'PATCH',
      body: JSON.stringify(params.role),
    },
    response: {
      contract: zodContract(RoleSchema),
    },
  });
}

export async function deleteRoleMutation(params: { roleId: number }) {
  return createJsonMutation({
    request: {
      url: baseUrl(`/roles/${params.roleId}`),
      method: 'DELETE',
    },
    response: {
      contract: zodContract(z.any()),
    },
  });
}

export async function attachRoleMutation(params: {
  roleId: number;
  userId: number;
}) {
  return createJsonMutation({
    request: {
      url: baseUrl(
        `/roles/${params.roleId}/user/${params.userId}/attach`,
      ),
      method: 'POST',
    },
    response: {
      contract: zodContract(z.any()),
    },
  });
}

export async function detachRoleMutation(params: {
  roleId: number;
  userId: number;
}) {
  return createJsonMutation({
    request: {
      url: baseUrl(
        `/roles/${params.roleId}/user/${params.userId}/detach`,
      ),
      method: 'POST',
    },
    response: {
      contract: zodContract(z.any()),
    },
  });
}