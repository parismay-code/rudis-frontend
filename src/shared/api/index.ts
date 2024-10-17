import { env } from '~shared/lib/env';

export function baseUrl(path: string) {
  const url = env('VITE_API_URL', 'no log');
  const port = env('VITE_API_PORT', '80');
  const method = port === '443' ? 'https' : 'http';

  console.log(import.meta.env.PROD);
  console.log(url);

  return `${method}://${url}:${port}/api${path}`;
}

export type { UnexpectedErrorDto } from './types';