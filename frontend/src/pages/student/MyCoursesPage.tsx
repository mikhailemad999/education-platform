import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLearningStore, useCourseStore, useAuthStore } from '../../store';

export const MyCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const enrollments = useLearningStore((state) => state.enrollments);
  const courses = useCourseStore((state) => state.courses);
  const setActiveLesson = useLearningStore((state) => state.setActiveLesson);

  const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'completed'>('all');

  // Map enrolled courses
  const enrolledCourses = enrollments
    .map((e) => {
      const course = courses.find((c) => c.id === e.courseId);
      return course ? { ...course, enrollment: e } : null;
    })
    .filter(Boolean) as (typeof courses[0] & { enrollment: typeof enrollments[0] })[];

  const filtered = enrolledCourses.filter((item) => {
    if (activeTab === 'in-progress') return item.enrollment.status === 'active';
    if (activeTab === 'completed') return item.enrollment.status === 'completed';
    return true;
  });

  const featuredEnrollment = enrolledCourses[0];

  const handleResume = (courseId: string, lectureId?: string) => {
    const targetLecture = lectureId || 'lec-1-3';
    setActiveLesson(courseId, targetLecture);
    navigate(`/learn/${courseId}/lecture/${targetLecture}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Student Top Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-standard">
        <div>
          <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
            Learner Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
            Welcome back, {user?.name || 'Engineer'}
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Track your lecture progress, laboratory PDFs, and verifiable completion certificates.
          </p>
        </div>

        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-primary text-xs font-semibold border border-border-control transition-colors"
        >
          <span className="material-symbols-outlined text-sm text-primary">add</span>
          <span>Enroll in New Track</span>
        </Link>
      </div>

      {/* Continue Learning Spotlight Hero */}
      {featuredEnrollment && (
        <div className="bg-surface-card border border-border-standard rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
                Continue Where You Left Off
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-text-contrast">
              {featuredEnrollment.title}
            </h2>

            <p className="text-xs text-text-secondary">
              Current Lesson:{' '}
              <strong className="text-text-primary">
                Lecture 03: Event-Driven Architecture with Kafka & NestJS CQRS
              </strong>
            </p>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-text-muted">Syllabus Completion</span>
                <span className="text-text-contrast font-bold">
                  {featuredEnrollment.enrollment.progressPercentage}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
                <div
                  className="h-full bg-primary-container rounded-full transition-all duration-500"
                  style={{ width: `${featuredEnrollment.enrollment.progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() =>
                handleResume(
                  featuredEnrollment.id,
                  featuredEnrollment.enrollment.lastLectureId
                )
              }
              className="px-6 py-3 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">play_arrow</span>
              <span>Resume Lecture</span>
            </button>
            <Link
              to={`/courses/${featuredEnrollment.id}`}
              className="px-5 py-3 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-secondary hover:text-text-primary text-xs font-semibold border border-border-control transition-colors"
            >
              View Syllabus
            </Link>
          </div>
        </div>
      )}

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-border-standard pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'all'
              ? 'bg-surface-interactive text-text-contrast border border-border-control'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          All Enrolled ({enrolledCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('in-progress')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'in-progress'
              ? 'bg-surface-interactive text-text-contrast border border-border-control'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'completed'
              ? 'bg-surface-interactive text-text-contrast border border-border-control'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Enrolled Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const isDone = item.enrollment.progressPercentage === 100;
          return (
            <div
              key={item.id}
              className="bg-surface-card border border-border-standard rounded-xl overflow-hidden flex flex-col justify-between hover:border-border-control transition-all shadow-md group"
            >
              <div>
                <div className="relative aspect-video w-full bg-surface-secondary overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent opacity-80"></div>
                  {isDone && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-status-success text-white shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      COMPLETED
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <span className="text-[11px] font-mono text-primary font-medium">
                    {item.categoryName}
                  </span>
                  <h3 className="text-sm font-semibold text-text-contrast line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-text-muted">By {item.instructorName}</p>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-[11px] font-mono text-text-muted">
                      <span>Progress</span>
                      <span className="text-text-primary font-semibold">
                        {item.enrollment.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isDone ? 'bg-status-success' : 'bg-primary-container'
                        }`}
                        style={{ width: `${item.enrollment.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  onClick={() =>
                    handleResume(item.id, item.enrollment.lastLectureId)
                  }
                  className="flex-1 h-9 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">play_circle</span>
                  <span>{isDone ? 'Review Course' : 'Resume'}</span>
                </button>

                {isDone && (
                  <Link
                    to={`/certificates/${item.id}`}
                    className="h-9 px-3 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-primary text-xs font-semibold border border-border-control flex items-center gap-1 transition-colors"
                    title="View Verifiable Certificate"
                  >
                    <span className="material-symbols-outlined text-sm text-status-success">
                      workspace_premium
                    </span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
