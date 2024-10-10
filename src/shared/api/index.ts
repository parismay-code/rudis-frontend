import { env } from '~shared/lib/env';

export function baseUrl(path: string) {
  const url = env('VITE_BACKEND_HOST', 'localhost');
  const port = env('VITE_BACKEND_PORT', '80');
  const method = port === '443' ? 'https' : 'http';

  return `${method}://${url}:${port}/api${path}`;
}

export type { UnexpectedErrorDto } from './types';