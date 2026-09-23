import { Injectable } from '@nestjs/common';
import { DatabaseService, UserEntity } from '../../database/database.service';

@Injectable()
export class SuperAdminService {
  constructor(private db: DatabaseService) {}

  async createAdmin(body: { name: string; email: string; department?: string }) {
    const newAdmin: UserEntity = {
      id: `user-admin-${Date.now()}`,
      name: body.name,
      email: body.email,
      password_hash: 'adminpass123',
      role: 'admin',
      status: 'active',
      created_at: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      title: body.department || 'Curriculum Quality Admin',
    };

    this.db.users.push(newAdmin);

    this.db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'superadmin@obsidian.edu',
      role: 'superadmin',
      action: 'ADMIN_INVITED',
      target: `${newAdmin.name} (${newAdmin.email})`,
      ip_address: '127.0.0.1',
      severity: 'high',
    });

    return newAdmin;
  }

  async getAllPayments() {
    return this.db.payments;
  }

  async getAuditLogs() {
    return this.db.auditLogs;
  }

  async getSettings() {
    return {
      platformCommissionPercentage: 15,
      stripeEnabled: true,
      checkPaymentEnabled: true,
      maxVideoDurationMinutes: 60,
      credentialVerificationAlgorithm: 'Ed25519',
      maintenanceMode: false,
    };
  }
}
