import React, { useState } from 'react';
import { useCourseStore } from '../../store';

export const InstructorAnalyticsPage: React.FC = () => {
  const [range, setRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d');
  const courses = useCourseStore((state) => state.courses);

  return (
    <div className="space-y-8">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-standard">
        <div>
          <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
            Instructional Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
            Revenue & Performance Metrics
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Deep dive into student enrollments velocity, completion drop-offs, and monthly royalties.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-card border border-border-control text-xs">
          {(['7d', '30d', '90d', '12m'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg font-mono font-semibold transition-colors ${
                range === r
                  ? 'bg-primary-container text-white shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Gross Revenue (30d)</span>
          <div className="text-2xl font-bold font-mono text-text-contrast">$48,920.00</div>
          <span className="text-[11px] text-status-success font-mono">+18.2% vs prev period</span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Instructor Net Royalty</span>
          <div className="text-2xl font-bold font-mono text-primary-bright">$41,582.00</div>
          <span className="text-[11px] text-text-muted font-mono">85% after platform share</span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">New Students Enrolled</span>
          <div className="text-2xl font-bold font-mono text-text-contrast">542</div>
          <span className="text-[11px] text-status-success font-mono">+4.8% conversion</span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Avg Watch Duration</span>
          <div className="text-2xl font-bold font-mono text-text-contrast">18.4 hrs</div>
          <span className="text-[11px] text-text-muted font-mono">92% completion rate</span>
        </div>
      </div>

      {/* SVG Interactive Revenue Trend Chart */}
      <div className="bg-surface-card border border-border-standard rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-text-contrast">Enrollment & Revenue Velocity</h3>
            <p className="text-xs text-text-muted">Daily incoming transaction volumes and active student minutes</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-primary">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
              Gross Royalties ($)
            </span>
            <span className="flex items-center gap-1.5 text-text-muted">
              <span className="w-2.5 h-2.5 rounded-full bg-border-control"></span>
              Baseline Average
            </span>
          </div>
        </div>

        {/* Crisp Chart Visualization */}
        <div className="w-full h-56 relative flex items-end justify-between pt-6 px-2">
          {[38, 52, 45, 68, 85, 72, 94, 88, 102, 118, 110, 134, 142].map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <div
                className="w-full max-w-[28px] rounded-t-lg bg-surface-secondary group-hover:bg-primary-container transition-all relative overflow-hidden"
                style={{ height: `${(val / 150) * 180}px` }}
              >
                <div
                  className="absolute bottom-0 inset-x-0 bg-primary-container opacity-80"
                  style={{ height: `${(val / 150) * 100}%` }}
                ></div>
              </div>
              <span className="text-[9px] font-mono text-text-muted">Day {idx * 2 + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Course Breakdown Table */}
      <div className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-semibold text-text-contrast uppercase tracking-wider font-mono">
          Masterclass Performance Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary text-text-muted uppercase text-[10px] font-mono tracking-wider border-b border-border-subtle">
              <tr>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Students</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4">Completion</th>
                <th className="py-3 px-4 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-surface-interactive/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-text-contrast">{c.title}</td>
                  <td className="py-3 px-4 font-mono">{c.enrolledStudents.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono font-bold text-text-contrast">
                    ${(c.enrolledStudents * c.price * 0.85).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 font-mono text-status-success">94.2%</td>
                  <td className="py-3 px-4 text-right font-mono text-status-warning font-semibold">
                    {c.rating.toFixed(2)} ★
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
