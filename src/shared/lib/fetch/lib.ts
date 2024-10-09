import { FetchApiRecord } from './types';

export function prepareFormData<T extends object>(data: T): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      formData.append(key, value);
    }
  });

  return formData;
}

export function formatUrl(config: { href: string; query: FetchApiRecord }) {
  const { href, query } = config;

  const url = new URL(href);
  const searchParams = recordToUrlSearchParams(query);

  url.search = searchParams.toString();

  return url;
}

export function formatHeaders(
  headersRecord: FetchApiRecord,
  formData: boolean = false,
): Headers {
  const headers = new Headers();
  headers.append('content-type', 'application/json');
  headers.append('x-requested-with', 'XMLHttpRequest');

  const token = localStorage.getItem('token');

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  Object.entries(headersRecord).forEach(([key, value]) => {
    const cleanValue = clearValue(value);

    if (Array.isArray(cleanValue)) {
      cleanValue.forEach((v) => headers.append(key, v));
    } else if (cleanValue !== null) {
      if (headers.has(key)) {
        headers.delete(key);
      }

      headers.append(key, cleanValue);
    }
  });

  if (formData) {
    headers.delete('content-type');
  }

  return headers;
}

export function recordToUrlSearchParams(
  record: FetchApiRecord,
): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(record).forEach(([key, value]) => {
    const cleanValue = clearValue(value);
    if (Array.isArray(cleanValue)) {
      cleanValue.forEach((v) => params.append(key, v));
    } else if (cleanValue !== null) {
      params.append(key, cleanValue);
    }
  });

  return params;
}

export function clearValue(
  value: string | string[] | number | boolean | null | undefined,
): string | string[] | null {
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }

  return value ?? null;
}