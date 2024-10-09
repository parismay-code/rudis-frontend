export function env(key: string, defaultValue: string = ''): string {
  if (Object.hasOwn(import.meta.env, key) && import.meta.env[key]) {
    return import.meta.env[key];
  }

  return defaultValue;
}