import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // SuperAdmin has unconditional access to all roles
    if (user && user.role === 'superadmin') {
      return true;
    }

    // Admin has access to admin and instructor routes
    if (user && user.role === 'admin' && (requiredRoles.includes('admin') || requiredRoles.includes('instructor'))) {
      return true;
    }

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Insufficient privileges. Required role: [${requiredRoles.join(', ')}]. Current role: [${user?.role || 'anonymous'}]`,
      );
    }

    return true;
  }
}
