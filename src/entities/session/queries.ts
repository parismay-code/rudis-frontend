import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/lib/react-router';
import { getCurrentUserQuery, loginUserMutation, registerUserMutation } from './api';
import { LoginUserDto, RegisterUserDto } from './types';
import { ReactQueryService } from '~shared/lib/react-query';

const keys = {
  root: () => ['session'] as const,
  current: () => [...keys.root(), 'current'] as const,
  login: () => [...keys.root(), 'login'] as const,
  register: () => [...keys.root(), 'register'] as const,
};

export const sessionService = new ReactQueryService(keys.current, getCurrentUserQuery);

export function useLoginUserMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: keys.login(),
    mutationFn: (data: LoginUserDto) => loginUserMutation(data),
    onSuccess: async ({ token }) => {
      localStorage.setItem('token', token);

      navigate(pathKeys.home());
    },
  });
}

export function useRegisterUserMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: keys.register(),
    mutationFn: (data: RegisterUserDto) => registerUserMutation(data),
    onSuccess: async ({ token }) => {
      localStorage.setItem('token', token);

      navigate(pathKeys.home());
    },
  });
}