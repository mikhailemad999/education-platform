import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class AdminService {
  constructor(private db: DatabaseService) {}

  async getAllUsers() {
    return this.db.users;
  }

  async updateUser(id: string, updates: any) {
    const user = this.db.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, updates);
    return user;
  }

  async getInstructors() {
    return this.db.users.filter((u) => u.role === 'instructor');
  }

  async approveInstructor(body: { name: string; email: string }) {
    let instructor = this.db.users.find((u) => u.email === body.email);
    if (!instructor) {
      instructor = {
        id: `user-inst-${Date.now()}`,
        name: body.name,
        email: body.email,
        password_hash: 'default123',
        role: 'instructor',
        status: 'active',
        created_at: new Date().toISOString().split('T')[0],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      };
      this.db.users.push(instructor);
    } else {
      instructor.status = 'active';
      instructor.role = 'instructor';
    }

    this.db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'admin@obsidian.edu',
      role: 'admin',
      action: 'INSTRUCTOR_APPROVED',
      target: `${instructor.name} (${instructor.email})`,
      ip_address: '127.0.0.1',
      severity: 'low',
    });

    return instructor;
  }

  async removeInstructor(id: string) {
    const user = this.db.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('Instructor not found');
    user.status = 'suspended';
    return { success: true, message: `Instructor ${id} suspended` };
  }

  async getPlatformStats() {
    const totalUsers = this.db.users.length;
    const totalInstructors = this.db.users.filter((u) => u.role === 'instructor').length;
    const publishedCourses = this.db.courses.filter((c) => c.status === 'published').length;
    const totalSales = this.db.payments
      .filter((p) => p.status === 'paid')
      .reduce((acc, p) => acc + p.amount, 0);

    return {
      totalUsers,
      totalInstructors,
      publishedCourses,
      totalSales,
      pendingChecksCount: this.db.payments.filter((p) => p.status === 'pending').length,
    };
  }
}
