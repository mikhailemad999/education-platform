import React, { useState } from 'react';
import { useCourseStore, useAuthStore } from '../../store';
import { CourseQuestion } from '../../types';

export const InstructorQAPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const questions = useCourseStore((state) => state.questions);
  const courses = useCourseStore((state) => state.courses);
  const addAnswer = useCourseStore((state) => state.addAnswer);
  const markQuestionResolved = useCourseStore((state) => state.markQuestionResolved);
  const deleteQuestion = useCourseStore((state) => state.deleteQuestion);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'awaiting' | 'all' | 'resolved'>('awaiting');

  // Reply states: map questionId -> replyText
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [expandedThreadIds, setExpandedThreadIds] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleToggleExpandThread = (id: string) => {
    setExpandedThreadIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePostAnswer = (questionId: string) => {
    const text = replyTextMap[questionId]?.trim();
    if (!text) return;

    addAnswer(questionId, {
      id: `ans-${Date.now()}`,
      questionId,
      userId: user?.id || 'user-instructor-1',
      userName: user?.name || 'Dr. Marcus Vance',
      userAvatar:
        user?.avatar ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      userRole: 'instructor',
      text,
      createdAt: 'Just now',
      isInstructorAnswer: true
    });

    setReplyTextMap((prev) => ({ ...prev, [questionId]: '' }));
    triggerToast('Official Faculty Answer published successfully!');
  };

  const handleToggleResolved = (questionId: string) => {
    markQuestionResolved(questionId);
    triggerToast('Question status updated.');
  };

  // Filter inquiries
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.lectureTitle && q.lectureTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCourse =
      selectedCourseFilter === 'all' || q.courseId === selectedCourseFilter;

    const isAwaiting = !q.hasInstructorReplied && q.status !== 'resolved';
    const isResolved = q.status === 'resolved';

    let matchesStatus = true;
    if (statusFilter === 'awaiting') matchesStatus = isAwaiting;
    if (statusFilter === 'resolved') matchesStatus = isResolved;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  const awaitingCount = questions.filter(
    (q) => !q.hasInstructorReplied && q.status !== 'resolved'
  ).length;
  const resolvedCount = questions.filter((q) => q.status === 'resolved').length;

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-surface-elevated text-text-contrast border border-primary-container px-4 py-2.5 rounded-xl shadow-2xl text-xs font-mono animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-6 border-b border-border-standard flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
            Pedagogical Support & Direct Mentorship
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
            Student Q&A & Support Inbox
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Address student inquiries, provide verified faculty architectural guidance, and resolve technical blockers.
          </p>
        </div>

        {awaitingCount > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-status-warning/15 border border-status-warning/30 text-status-warning text-xs font-mono self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-status-warning animate-pulse"></span>
            <span>{awaitingCount} questions awaiting faculty response</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-surface-card border border-border-standard rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Awaiting Faculty Reply</span>
            <span className="p-2 rounded-lg bg-status-warning/10 text-status-warning material-symbols-outlined text-base">
              pending_actions
            </span>
          </div>
          <div className="text-2xl font-bold text-text-contrast font-mono">{awaitingCount}</div>
          <div className="text-[11px] text-text-muted">Requires instructor attention</div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-card border border-border-standard rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Total Inquiries</span>
            <span className="p-2 rounded-lg bg-primary-container/10 text-primary material-symbols-outlined text-base">
              forum
            </span>
          </div>
          <div className="text-2xl font-bold text-text-contrast font-mono">{questions.length}</div>
          <div className="text-[11px] text-text-muted">Across all published courses</div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-card border border-border-standard rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Resolved Discussions</span>
            <span className="p-2 rounded-lg bg-status-success/10 text-status-success material-symbols-outlined text-base">
              task_alt
            </span>
          </div>
          <div className="text-2xl font-bold text-text-contrast font-mono">{resolvedCount}</div>
          <div className="text-[11px] text-status-success font-mono">98.4% resolution satisfaction</div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-card border border-border-standard rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Avg Response Latency</span>
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 material-symbols-outlined text-base">
              speed
            </span>
          </div>
          <div className="text-2xl font-bold text-text-contrast font-mono">2.4h</div>
          <div className="text-[11px] text-text-muted">Top 5% platform turnaround</div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-surface-card border border-border-standard rounded-2xl p-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student inquiries, keywords, lectures..."
            className="w-full bg-surface-secondary border border-border-control rounded-xl pl-10 pr-4 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container"
          />
        </div>

        {/* Course Filter */}
        <select
          value={selectedCourseFilter}
          onChange={(e) => setSelectedCourseFilter(e.target.value)}
          className="bg-surface-secondary border border-border-control rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary-container"
        >
          <option value="all">All Courses ({courses.length})</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-xl border border-border-control shrink-0">
          <button
            onClick={() => setStatusFilter('awaiting')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              statusFilter === 'awaiting'
                ? 'bg-status-warning/20 text-status-warning border border-status-warning/30 font-bold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <span>Needs Reply</span>
            <span className="px-1.5 py-0.2 rounded-full bg-status-warning text-black text-[10px] font-mono font-bold">
              {awaitingCount}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === 'all'
                ? 'bg-surface-elevated text-text-contrast border border-border-control shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            All ({questions.length})
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === 'resolved'
                ? 'bg-surface-elevated text-text-contrast border border-border-control shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>
      </div>

      {/* Questions Feed */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-surface-card border border-border-standard rounded-2xl p-12 text-center text-text-muted">
            <span className="material-symbols-outlined text-4xl mb-3 text-status-success block">
              task_alt
            </span>
            <h3 className="text-sm font-bold text-text-contrast mb-1">
              Inbox Zero in this Category!
            </h3>
            <p className="text-xs max-w-md mx-auto">
              All student engineering inquiries under this filter have been answered or resolved.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isThreadExpanded = expandedThreadIds[q.id] ?? false;
            const currentReplyText = replyTextMap[q.id] || '';

            return (
              <div
                key={q.id}
                className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-4 shadow-md transition-all hover:border-border-control"
              >
                {/* Meta Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
                  <div className="flex items-center gap-3">
                    <img
                      src={q.userAvatar}
                      alt={q.userName}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-border-standard shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-contrast">{q.userName}</span>
                        {q.userTitle && (
                          <span className="px-2 py-0.5 rounded bg-surface-secondary text-[10px] text-text-muted font-mono border border-border-subtle">
                            {q.userTitle}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
                        <span>{q.createdAt}</span>
                        <span>•</span>
                        <span className="font-mono text-primary font-semibold">
                          ▲ {q.upvotes} upvotes
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* Status Pill */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        q.status === 'resolved'
                          ? 'bg-status-success/15 text-status-success'
                          : !q.hasInstructorReplied
                          ? 'bg-status-warning/15 text-status-warning'
                          : 'bg-primary-container/15 text-primary'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          q.status === 'resolved'
                            ? 'bg-status-success'
                            : !q.hasInstructorReplied
                            ? 'bg-status-warning'
                            : 'bg-primary-container'
                        }`}
                      ></span>
                      {q.status === 'resolved'
                        ? 'RESOLVED'
                        : !q.hasInstructorReplied
                        ? 'AWAITING REPLY'
                        : 'ANSWERED'}
                    </span>

                    {/* Toggle Resolved */}
                    <button
                      onClick={() => handleToggleResolved(q.id)}
                      title={q.status === 'resolved' ? 'Reopen Inquiry' : 'Mark as Resolved'}
                      className="p-1.5 rounded-lg bg-surface-secondary border border-border-control text-text-muted hover:text-status-success transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {q.status === 'resolved' ? 'undo' : 'check'}
                      </span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this inquiry from student forum?')) {
                          deleteQuestion(q.id);
                          triggerToast('Inquiry removed.');
                        }
                      }}
                      title="Remove Inquiry"
                      className="p-1.5 rounded-lg bg-surface-secondary border border-border-control text-text-muted hover:text-status-danger transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>

                {/* Course & Lecture Context Pill */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-surface-secondary text-text-contrast font-medium border border-border-subtle flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">school</span>
                    <span>{q.courseTitle || 'Distributed Systems Masterclass'}</span>
                  </span>
                  {q.lectureTitle && (
                    <span className="px-2.5 py-1 rounded-lg bg-surface-secondary text-text-secondary text-[11px] font-mono border border-border-subtle flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-text-muted">
                        play_circle
                      </span>
                      <span>{q.lectureTitle}</span>
                    </span>
                  )}
                </div>

                {/* Question Content */}
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-text-contrast">{q.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed bg-surface-secondary/40 p-3.5 rounded-xl border border-border-subtle font-sans">
                    {q.content}
                  </p>
                </div>

                {/* Answers Thread */}
                {q.answers.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleToggleExpandThread(q.id)}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 font-mono"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {isThreadExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                        <span>
                          {isThreadExpanded
                            ? 'Hide Discussion Thread'
                            : `View Thread (${q.answers.length} response${
                                q.answers.length > 1 ? 's' : ''
                              })`}
                        </span>
                      </button>
                    </div>

                    {isThreadExpanded && (
                      <div className="space-y-3 pl-3 border-l-2 border-border-control">
                        {q.answers.map((ans) => (
                          <div
                            key={ans.id}
                            className={`p-3.5 rounded-xl text-xs space-y-2 ${
                              ans.isInstructorAnswer
                                ? 'bg-primary-container/10 border border-primary-container/30 ring-1 ring-primary-container/20'
                                : 'bg-surface-secondary border border-border-subtle'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img
                                  src={ans.userAvatar}
                                  alt={ans.userName}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="font-bold text-text-contrast">
                                  {ans.userName}
                                </span>
                                {ans.isInstructorAnswer && (
                                  <span className="px-2 py-0.5 rounded bg-primary-container text-white text-[10px] font-mono font-bold">
                                    Faculty Verified
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-text-muted font-mono">
                                {ans.createdAt}
                              </span>
                            </div>
                            <p className="text-text-secondary leading-relaxed font-sans">
                              {ans.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Inline Instructor Reply Box */}
                <div className="pt-2 border-t border-border-subtle space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-text-contrast">
                    <span className="material-symbols-outlined text-sm text-primary">reply</span>
                    <span>Post Official Faculty Response</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <textarea
                      rows={2}
                      value={currentReplyText}
                      onChange={(e) =>
                        setReplyTextMap((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      placeholder="Write authoritative architecture solution, link documentation, or paste code snippet..."
                      className="flex-1 bg-surface-secondary border border-border-control rounded-xl p-3 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container font-mono"
                    ></textarea>
                    <button
                      onClick={() => handlePostAnswer(q.id)}
                      disabled={!currentReplyText.trim()}
                      className="px-4 py-2 rounded-xl bg-primary-container hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-md transition-all shrink-0 self-end sm:self-stretch flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                      <span>Publish Answer</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
