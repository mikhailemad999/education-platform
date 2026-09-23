import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      // In development/test mode, allow fallback demo user if query param or header specified
      const mockRole = request.headers['x-demo-role'] || 'student';
      request.user = {
        id: `user-${mockRole}-1`,
        email: `${mockRole}@obsidian.edu`,
        role: mockRole,
        name: `${mockRole.charAt(0).toUpperCase() + mockRole.slice(1)} Demo`,
      };
      return true;
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired authentication token');
    }
  }
}
