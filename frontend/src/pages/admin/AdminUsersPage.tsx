import React, { useState } from 'react';
import { MOCK_USERS } from '../../services/mockData';
import { User, UserRole } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    MOCK_USERS.student,
    MOCK_USERS.instructor,
    MOCK_USERS.admin,
    MOCK_USERS.superadmin,
    {
      id: 'user-stu-2',
      name: 'Morgan Reed',
      email: 'morgan.reed@techcorp.com',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      createdAt: '2025-02-10'
    },
    {
      id: 'user-stu-3',
      name: 'Sarah Connor',
      email: 'sarah.c@security.io',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      status: 'suspended',
      createdAt: '2024-12-01'
    }
  ]);

  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
  };

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-standard">
        <div>
          <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
            Identity Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
            User Account Management
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Review user identities, change security permissions, and suspend unauthorized accounts.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="bg-surface-card border border-border-control rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-surface-card border border-border-control rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary-container font-mono"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
            <option value="superadmin">SuperAdmin</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-surface-card border border-border-standard rounded-2xl p-6 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary text-text-muted uppercase text-[10px] font-mono tracking-wider border-b border-border-subtle">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-surface-interactive/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-border-standard"
                      />
                      <div>
                        <div className="font-semibold text-text-contrast">{u.name}</div>
                        <div className="text-[11px] text-text-muted font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-surface-secondary text-text-primary border border-border-control">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        u.status === 'active'
                          ? 'bg-status-success/15 text-status-success'
                          : 'bg-status-danger/15 text-status-danger'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-text-muted text-[11px]">{u.createdAt}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        u.status === 'active'
                          ? 'bg-surface-interactive text-status-danger hover:bg-status-danger/20'
                          : 'bg-status-success/20 text-status-success hover:bg-status-success/30'
                      }`}
                    >
                      {u.status === 'active' ? 'Suspend User' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
