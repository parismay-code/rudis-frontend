import { Role } from './types';

export function hasRole(
  needle: string | Array<string>,
  roles: Array<Role>,
  strict: boolean = true,
): boolean {
  if (Array.isArray(needle)) {
    const needleRoles = roles.filter((role) => needle.includes(role.name));

    if (strict) {
      return needleRoles.length === roles.length;
    }

    return needleRoles.length > 0;
  }

  return roles.some((role) => role.name === needle);
}