import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../../store';
import { Course } from '../../types';

export const AdminCoursesPage: React.FC = () => {
  const courses = useCourseStore((state) => state.courses);
  const updateCourse = useCourseStore((state) => state.updateCourse);

  const [filter, setFilter] = useState<'all' | 'published' | 'pending_review' | 'draft'>('all');
  const [search, setSearch] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  const handlePublish = (course: Course) => {
    updateCourse(course.id, { status: 'published' });
    setActionNotice(`Course "${course.title}" has been approved and published to the production catalog.`);
    setTimeout(() => setActionNotice(''), 3500);
  };

  const handleRequestRevision = (course: Course) => {
    updateCourse(course.id, { status: 'pending_review' });
    setActionNotice(`Revision requested for "${course.title}". Faculty notified.`);
    setTimeout(() => setActionNotice(''), 3500);
  };

  const handleArchive = (course: Course) => {
    updateCourse(course.id, { status: 'draft' });
    setActionNotice(`Course "${course.title}" archived back to draft.`);
    setTimeout(() => setActionNotice(''), 3500);
  };

  const filtered = courses.filter((c) => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructorName.toLowerCase().includes(search.toLowerCase()) ||
      c.categoryName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-standard">
        <div>
          <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
            Catalog Quality Assurance
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
            Course Moderation & Quality Control
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Review submitted curriculum structures, video streaming assets, and authorize masterclass publication.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-surface-secondary border border-border-standard text-xs font-mono text-text-muted">
            Total Courses: <strong className="text-text-contrast">{courses.length}</strong>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-status-success/10 border border-status-success/30 text-status-success text-xs flex items-center gap-2 animate-fade-in font-medium">
          <span className="material-symbols-outlined text-base">verified</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 bg-surface-card p-1 rounded-xl border border-border-standard text-xs">
          {(['all', 'published', 'pending_review', 'draft'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === s
                  ? 'bg-primary-container text-white shadow-sm font-semibold'
                  : 'text-text-muted hover:text-text-contrast hover:bg-surface-secondary'
              }`}
            >
              {s === 'pending_review' ? 'Pending Review' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-72 relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-base">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search masterclass or faculty..."
            className="w-full bg-surface-card border border-border-standard rounded-xl pl-9 pr-3.5 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container"
          />
        </div>
      </div>

      {/* Courses Grid / Table */}
      <div className="bg-surface-card border border-border-standard rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary border-b border-border-standard text-text-muted uppercase text-[10px] font-mono tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Masterclass Details</th>
                <th className="px-6 py-3.5">Category & Level</th>
                <th className="px-6 py-3.5">Price & Volume</th>
                <th className="px-6 py-3.5">Review Status</th>
                <th className="px-6 py-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filtered.map((course) => (
                <tr key={course.id} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-14 h-10 object-cover rounded-lg border border-border-standard shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/courses/${course.id}`}
                          className="font-semibold text-text-contrast text-sm hover:text-primary transition-colors truncate block"
                        >
                          {course.title}
                        </Link>
                        <div className="text-text-muted text-[11px] pt-0.5">
                          Lead Architect: <span className="text-text-primary">{course.instructorName}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-text-contrast">{course.categoryName}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-mono bg-surface-secondary text-text-muted border border-border-subtle uppercase">
                      {course.level}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-mono text-text-contrast font-bold text-sm">
                      ${course.price.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-text-muted">
                      {course.enrolledStudents.toLocaleString()} learners · ⭐ {course.rating.toFixed(2)}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        course.status === 'published'
                          ? 'bg-status-success/15 text-status-success border border-status-success/30'
                          : course.status === 'pending_review'
                          ? 'bg-status-warning/15 text-status-warning border border-status-warning/30'
                          : 'bg-surface-secondary text-text-muted border border-border-standard'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          course.status === 'published'
                            ? 'bg-status-success'
                            : course.status === 'pending_review'
                            ? 'bg-status-warning animate-pulse'
                            : 'bg-text-muted'
                        }`}
                      ></span>
                      {course.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/courses/${course.id}`}
                        className="px-2.5 py-1.5 rounded-lg bg-surface-secondary hover:bg-surface-interactive text-text-secondary hover:text-text-contrast border border-border-standard text-xs transition-colors"
                      >
                        Preview
                      </Link>

                      {course.status !== 'published' ? (
                        <button
                          onClick={() => handlePublish(course)}
                          className="px-3 py-1.5 rounded-lg bg-status-success text-black font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">publish</span>
                          <span>Approve & Publish</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleArchive(course)}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-secondary hover:bg-status-danger/10 text-text-muted hover:text-status-danger border border-border-standard text-xs transition-colors"
                        >
                          Unpublish
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
