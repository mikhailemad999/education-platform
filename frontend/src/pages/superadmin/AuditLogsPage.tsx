import React, { useState } from 'react';
import { MOCK_AUDIT_LOGS } from '../../services/mockData';

export const AuditLogsPage: React.FC = () => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = MOCK_AUDIT_LOGS.filter((log) => {
    const matchSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    const matchSearch =
      !search ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase());
    return matchSeverity && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-standard">
        <div>
          <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
            Telemetry & Compliance
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
            Security & System Audit Logs
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Immutable, real-time audit trail of all administrative actions, policy adjustments, and financial operations.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action or actor..."
            className="bg-surface-card border border-border-control rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container"
          />

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-surface-card border border-border-control rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary-container font-mono"
          >
            <option value="all">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-surface-card border border-border-standard rounded-2xl p-6 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary text-text-muted uppercase text-[10px] font-mono tracking-wider border-b border-border-subtle">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Detail</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-surface-interactive/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-text-muted text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-mono text-text-primary">{log.actor}</td>
                  <td className="py-3 px-4 font-mono font-bold text-text-contrast">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-text-secondary max-w-sm truncate">
                    {log.target}
                  </td>
                  <td className="py-3 px-4 font-mono text-text-muted text-[11px]">
                    {log.ipAddress}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        log.severity === 'low'
                          ? 'bg-status-success/15 text-status-success'
                          : log.severity === 'medium'
                          ? 'bg-status-warning/15 text-status-warning'
                          : 'bg-status-danger/15 text-status-danger'
                      }`}
                    >
                      {log.severity}
                    </span>
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
