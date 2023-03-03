import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../constants/user-role.constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
