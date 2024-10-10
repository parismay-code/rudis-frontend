import { z } from 'zod';

export const LoginUserDtoSchema = z.object({
  login: z.string(),
  password: z.string(),
});

export const RegisterUserDtoSchema = z.object({
  login: z.string().min(4, 'Минимальная длина логина - 4 символа').max(28, 'Максимальная длина логина - 28 символов'),
  password: z.string().min(8, 'Минимальная длина пароля - 8 символов').max(20, 'Максимальная длина пароля - 20 символов'),
  passwordConfirmation: z
    .string()
    .min(8, 'Минимальная длина пароля - 8 символов').max(20, 'Максимальная длина пароля - 20 символов'),
});

export const JwtTokenSchema = z.object({
  token: z.string(),
});