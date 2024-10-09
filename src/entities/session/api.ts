import { baseUrl } from '~shared/api';
import { createJsonMutation, createJsonQuery } from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { LoginUserDto, type RegisterUserDto } from './types';
import { JwtTokenSchema } from '~entities/session/contracts.ts';
import { UserSchema } from '~entities/users';
import { z } from 'zod';

export async function getCurrentUserQuery() {
  return createJsonQuery({
    request: {
      url: baseUrl('/auth/user'),
      method: 'GET',
    },
    response: {
      contract: zodContract(z.object({ user: UserSchema }).and(JwtTokenSchema)),
      mapData: ({ user, token }) => {
        localStorage.setItem('token', token);

        return user;
      },
    },
  });
}

export async function loginUserMutation(data: LoginUserDto) {
  return createJsonMutation({
    request: {
      url: baseUrl('/auth/login'),
      method: 'POST',
      body: JSON.stringify(data),
    },
    response: {
      contract: zodContract(JwtTokenSchema),
    },
  });
}

export async function registerUserMutation(data: RegisterUserDto) {
  return createJsonMutation({
    request: {
      url: baseUrl('/auth/register'),
      method: 'POST',
      body: JSON.stringify(data),
    },
    response: {
      contract: zodContract(JwtTokenSchema),
    },
  });
}