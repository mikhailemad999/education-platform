import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCourseStore, useAuthStore } from '../../store';

export const InstructorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const courses = useCourseStore((state) => state.courses);
  const updateCourse = useCourseStore((state) => state.updateCourse);

  const toggleStatus = (id: string, currentStatus: string) => {
    updateCourse(id, {
      status: currentStatus === 'published' ? 'draft' : 'published'
    });
  };

  const totalStudents = courses.reduce((acc, c) => acc + c.enrolledStudents, 0);
  const totalRevenue = courses.reduce((acc, c) => acc + c.enrolledStudents * c.price * 0.85, 0);

  return (
    <div className="space-y-8">
      {/* Top Header & Fast Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-standard">
        <div>
          <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
            Instructional Faculty Core
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
            Studio Overview & Courses
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Welcome back, {user?.name || 'Instructor'}. Manage your published syllabuses, video uploads, and royalties.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/instructor/courses/new"
            className="px-4 py-2.5 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 text-white text-xs font-semibold transition-all shadow-md flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Create New Masterclass</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-text-muted">
            <span className="text-xs uppercase font-mono">Total Students</span>
            <span className="material-symbols-outlined text-primary text-base">group</span>
          </div>
          <div className="text-2xl font-bold font-mono text-text-contrast">
            {totalStudents.toLocaleString()}
          </div>
          <div className="text-[11px] text-status-success font-mono">+12.4% this month</div>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-text-muted">
            <span className="text-xs uppercase font-mono">Net Royalties</span>
            <span className="material-symbols-outlined text-primary text-base">payments</span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary-bright">
            ${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-text-muted font-mono">85% platform payout rate</div>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-text-muted">
            <span className="text-xs uppercase font-mono">Active Masterclasses</span>
            <span className="material-symbols-outlined text-primary text-base">layers</span>
          </div>
          <div className="text-2xl font-bold font-mono text-text-contrast">
            {courses.length}
          </div>
          <div className="text-[11px] text-text-muted font-mono">All verified & published</div>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-text-muted">
            <span className="text-xs uppercase font-mono">Average Rating</span>
            <span className="material-symbols-outlined text-status-warning text-base">star</span>
          </div>
          <div className="text-2xl font-bold font-mono text-text-contrast">
            4.94 ★
          </div>
          <div className="text-[11px] text-text-muted font-mono">Across 7,800+ reviews</div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <h3 className="text-sm font-semibold text-text-contrast uppercase tracking-wider font-mono">
            My Course Catalog & Curriculum
          </h3>
          <span className="text-[11px] font-mono text-text-muted">
            {courses.length} Masterclasses
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary text-text-muted uppercase text-[10px] font-mono tracking-wider border-b border-border-subtle">
              <tr>
                <th className="py-3 px-4">Masterclass</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Students</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-surface-interactive/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.thumbnail}
                        alt=""
                        className="w-12 h-8 rounded object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-text-contrast truncate max-w-xs sm:max-w-sm">
                          {c.title}
                        </div>
                        <div className="text-[11px] text-text-muted font-mono">
                          {c.categoryName} • {c.duration}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-text-contrast">
                    ${c.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {c.enrolledStudents.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-status-warning font-semibold">
                    {c.rating.toFixed(2)} ★
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleStatus(c.id, c.status)}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-colors ${
                        c.status === 'published'
                          ? 'bg-status-success/15 text-status-success hover:bg-status-danger/20'
                          : 'bg-surface-secondary text-text-muted hover:bg-status-success/20'
                      }`}
                    >
                      {c.status}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/instructor/courses/${c.id}/edit`)}
                      className="px-2.5 py-1 rounded bg-surface-interactive hover:bg-surface-elevated text-text-primary text-[11px] font-semibold border border-border-control transition-colors"
                    >
                      Edit Curriculum
                    </button>
                    <Link
                      to="/instructor/analytics"
                      className="px-2.5 py-1 rounded bg-surface-interactive hover:bg-surface-elevated text-primary text-[11px] font-semibold border border-border-control transition-colors"
                    >
                      Metrics
                    </Link>
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
