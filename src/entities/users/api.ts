import { baseUrl } from '~shared/api';
import { createJsonMutation, createJsonQuery } from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { UserSchema } from './contracts';
import { SetUserRoleDto, UserDto } from './types';

export async function getAllUsersQuery(
  signal?: AbortSignal,
) {
  return createJsonQuery({
    request: {
      url: baseUrl('/users'),
      method: 'GET',
    },
    response: {
      contract: zodContract(UserSchema.array()),
    },
    abort: signal,
  });
}

export async function getUserQuery(id: number, signal?: AbortSignal) {
  return createJsonQuery({
    request: {
      url: baseUrl(`/users/${id}`),
      method: 'GET',
    },
    response: {
      contract: zodContract(UserSchema),
    },
    abort: signal,
  });
}

export async function createUserMutation(data: UserDto) {
  return createJsonMutation({
    request: {
      url: baseUrl('/users'),
      method: 'POST',
      body: JSON.stringify(data),
    },
    response: {
      contract: zodContract(UserSchema),
    },
  });
}

export async function updateUserMutation(params: { id: number, data: UserDto }) {
  return createJsonMutation({
    request: {
      url: baseUrl(`/users/${params.id}`),
      method: 'PATCH',
      body: JSON.stringify(params.data),
    },
    response: {
      contract: zodContract(UserSchema),
    },
  });
}

export async function deleteUserMutation(id: number) {
  return createJsonMutation({
    request: {
      url: baseUrl(`/users/${id}`),
      method: 'DELETE',
    },
    response: {
      contract: zodContract(UserSchema),
    },
  });
}

export async function addUserRoleMutation(data: SetUserRoleDto) {
  return createJsonMutation({
    request: {
      url: baseUrl('/users/roles'),
      method: 'POST',
      body: JSON.stringify(data),
    },
    response: {
      contract: zodContract(UserSchema),
    },
  });
}

export async function removeUserRoleMutation(data: SetUserRoleDto) {
  return createJsonMutation({
    request: {
      url: baseUrl('/users/roles'),
      method: 'DELETE',
      body: JSON.stringify(data),
    },
    response: {
      contract: zodContract(UserSchema),
    },
  });
}