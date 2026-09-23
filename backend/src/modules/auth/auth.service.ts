import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database/database.service';

const KNOWN_PASSWORDS: Record<string, string> = {
  'viktor.kane@obsidian.edu': 'SuperAdmin@2026!',
  'superadmin': 'SuperAdmin@2026!',
  'elena.rostova@obsidian.edu': 'AdminPass@2026!',
  'admin': 'AdminPass@2026!',
  'marcus.vance@obsidian.edu': 'InstructorPass@2026!',
  'instructor': 'InstructorPass@2026!',
  'alex.rivera@engineer.io': 'StudentPass@2026!',
  'student': 'StudentPass@2026!',
};

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async register(body: { name: string; email: string; password: string; role?: 'student' | 'instructor' }) {
    const existing = this.db.users.find((u) => u.email.toLowerCase() === body.email.toLowerCase());
    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: body.name,
      email: body.email.toLowerCase(),
      password_hash: body.password,
      role: body.role || 'student',
      status: (body.role === 'instructor' ? 'pending' : 'active') as 'active' | 'pending' | 'suspended',
      created_at: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    this.db.users.push(newUser);

    const payload = { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name };
    const token = this.jwtService.sign(payload);

    return {
      user: newUser,
      token,
      message: newUser.role === 'instructor' ? 'Registration pending admin approval.' : 'Registration successful.',
    };
  }

  async login(body: { email: string; password?: string; role?: string }) {
    const cleanId = (body.email || '').trim().toLowerCase();
    const cleanPass = (body.password || '').trim();

    if (!cleanId || !cleanPass) {
      throw new BadRequestException('Please provide both username/email and password.');
    }

    // Lookup user by email or role shortcut
    let user = this.db.users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.role.toLowerCase() === cleanId ||
        u.name.toLowerCase().replace(/\s+/g, '') === cleanId
    );

    if (!user) {
      throw new UnauthorizedException('No account found matching these credentials.');
    }

    // Validate password
    const expectedPassword = KNOWN_PASSWORDS[cleanId] || KNOWN_PASSWORDS[user.email.toLowerCase()] || user.password_hash;
    if (cleanPass !== expectedPassword && cleanPass !== user.password_hash) {
      throw new UnauthorizedException('Invalid credentials provided.');
    }

    if (user.status === 'suspended') {
      throw new UnauthorizedException('Your account has been suspended by administration.');
    }

    // Role check if required
    if (body.role && user.role !== body.role) {
      throw new UnauthorizedException(`Account role [${user.role}] does not match required role [${body.role}].`);
    }

    const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
    const token = this.jwtService.sign(payload);

    return {
      user,
      token,
    };
  }

  async getProfile(userId: string) {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}
