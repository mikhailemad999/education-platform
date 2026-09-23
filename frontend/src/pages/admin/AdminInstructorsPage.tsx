import React, { useState } from 'react';
import { useAuthStore } from '../../store';
import { MOCK_USERS } from '../../services/mockData';

interface InstructorApplication {
  id: string;
  name: string;
  email: string;
  specialty: string;
  experience: string;
  status: 'active' | 'pending' | 'suspended';
  coursesCount: number;
  studentsCount: number;
  rating: number;
  appliedDate: string;
}

const INITIAL_INSTRUCTORS: InstructorApplication[] = [
  {
    id: 'inst-1',
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@obsidian.edu',
    specialty: 'Distributed Systems & Cloud Architecture',
    experience: '15+ years · ex-AWS Principal Architect',
    status: 'active',
    coursesCount: 4,
    studentsCount: 33320,
    rating: 4.95,
    appliedDate: '2024-03-10'
  },
  {
    id: 'inst-2',
    name: 'Sarah Connor',
    email: 'sarah.c@kernel.org',
    specialty: 'Linux Kernel & eBPF Telemetry',
    experience: '12+ years · Linux Foundation Fellow',
    status: 'active',
    coursesCount: 2,
    studentsCount: 14850,
    rating: 4.98,
    appliedDate: '2024-05-18'
  },
  {
    id: 'inst-3',
    name: 'David K. Brovski',
    email: 'david.b@cryptomesh.io',
    specialty: 'Zero-Knowledge Cryptography & Rust',
    experience: '8+ years · Lead Protocol Engineer',
    status: 'pending',
    coursesCount: 0,
    studentsCount: 0,
    rating: 5.0,
    appliedDate: '2026-09-22'
  },
  {
    id: 'inst-4',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@quantumgrid.dev',
    specialty: 'Kubernetes Platform Engineering & Service Mesh',
    experience: '10+ years · CNCF Ambassador',
    status: 'pending',
    coursesCount: 0,
    studentsCount: 0,
    rating: 5.0,
    appliedDate: '2026-09-23'
  }
];

export const AdminInstructorsPage: React.FC = () => {
  const [instructors, setInstructors] = useState<InstructorApplication[]>(INITIAL_INSTRUCTORS);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [search, setSearch] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  const handleApprove = (id: string, name: string) => {
    setInstructors((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, status: 'active' } : inst))
    );
    setActionNotice(`Instructor credentials for "${name}" verified and approved.`);
    setTimeout(() => setActionNotice(''), 3000);
  };

  const handleSuspend = (id: string, name: string) => {
    setInstructors((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, status: 'suspended' } : inst))
    );
    setActionNotice(`Instructor status for "${name}" set to suspended.`);
    setTimeout(() => setActionNotice(''), 3000);
  };

  const handleReinstate = (id: string, name: string) => {
    setInstructors((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, status: 'active' } : inst))
    );
    setActionNotice(`Instructor "${name}" has been reinstated.`);
    setTimeout(() => setActionNotice(''), 3000);
  };

  const filtered = instructors.filter((inst) => {
    const matchesFilter = filter === 'all' || inst.status === filter;
    const matchesSearch =
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.email.toLowerCase().includes(search.toLowerCase()) ||
      inst.specialty.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalActive = instructors.filter((i) => i.status === 'active').length;
  const totalPending = instructors.filter((i) => i.status === 'pending').length;

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-standard">
        <div>
          <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
            Faculty Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
            Instructor Management & Approvals
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Review educator credentials, approve new faculty applications, and enforce syllabus standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-surface-secondary border border-border-standard text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-success"></span>
            <span className="text-text-muted font-mono">{totalActive} Verified Faculty</span>
          </div>
          {totalPending > 0 && (
            <div className="px-3 py-1.5 rounded-lg bg-status-warning/15 border border-status-warning/30 text-status-warning text-xs font-mono font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">pending_actions</span>
              <span>{totalPending} Pending</span>
            </div>
          )}
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-status-success/10 border border-status-success/30 text-status-success text-xs flex items-center gap-2 animate-fade-in font-medium">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-surface-card p-1 rounded-xl border border-border-standard text-xs">
          {(['all', 'active', 'pending', 'suspended'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-all ${
                filter === s
                  ? 'bg-primary-container text-white shadow-sm'
                  : 'text-text-muted hover:text-text-contrast hover:bg-surface-secondary'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-72 relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-base">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search faculty or specialty..."
            className="w-full bg-surface-card border border-border-standard rounded-xl pl-9 pr-3.5 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container"
          />
        </div>
      </div>

      {/* Instructors Table */}
      <div className="bg-surface-card border border-border-standard rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary border-b border-border-standard text-text-muted uppercase text-[10px] font-mono tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Instructor Name & Domain</th>
                <th className="px-6 py-3.5">Experience & Credentials</th>
                <th className="px-6 py-3.5">Catalog Impact</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filtered.map((inst) => (
                <tr key={inst.id} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-text-contrast text-sm">{inst.name}</div>
                    <div className="text-text-muted font-mono text-[11px]">{inst.email}</div>
                    <div className="text-primary text-[11px] font-medium pt-0.5">{inst.specialty}</div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    <div>{inst.experience}</div>
                    <div className="text-[10px] text-text-muted font-mono mt-0.5">Applied: {inst.appliedDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-text-contrast">
                      <strong>{inst.coursesCount}</strong> masterclasses
                    </div>
                    <div className="text-[11px] text-text-muted">
                      {inst.studentsCount.toLocaleString()} learners · ⭐ {inst.rating.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        inst.status === 'active'
                          ? 'bg-status-success/15 text-status-success border border-status-success/30'
                          : inst.status === 'pending'
                          ? 'bg-status-warning/15 text-status-warning border border-status-warning/30'
                          : 'bg-status-danger/15 text-status-danger border border-status-danger/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          inst.status === 'active'
                            ? 'bg-status-success'
                            : inst.status === 'pending'
                            ? 'bg-status-warning animate-pulse'
                            : 'bg-status-danger'
                        }`}
                      ></span>
                      {inst.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inst.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(inst.id, inst.name)}
                          className="px-3 py-1.5 rounded-lg bg-status-success text-black font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">verified</span>
                          <span>Approve Faculty</span>
                        </button>
                      )}

                      {inst.status === 'active' && (
                        <button
                          onClick={() => handleSuspend(inst.id, inst.name)}
                          className="px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-status-danger/10 text-text-muted hover:text-status-danger border border-border-standard hover:border-status-danger/30 text-xs transition-colors"
                        >
                          Suspend
                        </button>
                      )}

                      {inst.status === 'suspended' && (
                        <button
                          onClick={() => handleReinstate(inst.id, inst.name)}
                          className="px-3 py-1.5 rounded-lg bg-primary-container hover:brightness-110 text-white font-semibold text-xs transition-all"
                        >
                          Reinstate
                        </button>
                      )}
                    </div>
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
