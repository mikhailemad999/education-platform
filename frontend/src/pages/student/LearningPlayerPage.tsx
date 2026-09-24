import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourseStore, useLearningStore, useAuthStore } from '../../store';
import { CourseQuestion, CourseAnswer } from '../../types';

export const LearningPlayerPage: React.FC = () => {
  const { courseId, lectureId } = useParams<{ courseId: string; lectureId: string }>();
  const navigate = useNavigate();

  const getCourseById = useCourseStore((state) => state.getCourseById);
  const courses = useCourseStore((state) => state.courses);
  const course = getCourseById(courseId || 'course-1') || courses[0];

  const questions = useCourseStore((state) => state.questions);
  const addQuestion = useCourseStore((state) => state.addQuestion);
  const upvoteQuestion = useCourseStore((state) => state.upvoteQuestion);
  const addAnswer = useCourseStore((state) => state.addAnswer);

  const enrollments = useLearningStore((state) => state.enrollments);
  const markLectureComplete = useLearningStore((state) => state.markLectureComplete);
  const saveNote = useLearningStore((state) => state.saveNote);
  const userNotes = useLearningStore((state) => state.userNotes);
  const user = useAuthStore((state) => state.user);

  const enrollment = enrollments.find((e) => e.courseId === course.id);
  const completedIds = enrollment?.completedLectureIds || [];

  // Flatten all lectures to navigate prev/next
  const allLectures = course.sections.flatMap((s) => s.lectures);
  const currentLectureIndex = allLectures.findIndex((l) => l.id === lectureId);
  const activeLecture = allLectures[currentLectureIndex >= 0 ? currentLectureIndex : 0];

  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'qa' | 'resources' | 'quiz'>('overview');
  const [notesViewMode, setNotesViewMode] = useState<'active' | 'digest'>('active');
  const [noteContent, setNoteContent] = useState(userNotes[activeLecture?.id || ''] || '');
  const [noteSaved, setNoteSaved] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [pdfZoom, setPdfZoom] = useState(100);

  // Q&A state
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [newQTitle, setNewQTitle] = useState('');
  const [newQContent, setNewQContent] = useState('');
  const [qaSearch, setQaSearch] = useState('');
  const [qaScope, setQaScope] = useState<'all' | 'lecture'>('all');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [qaNotice, setQaNotice] = useState('');

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: 'In high-throughput transactional outbox patterns with Kafka, how do you eliminate duplicate downstream processing?',
      options: [
        'By utilizing 2-phase commits across distributed databases',
        'By implementing idempotent consumer receivers using a deduplication store with event IDs',
        'By disabling Kafka topic partitions and running a single broker thread',
        'By replacing message brokers with synchronous REST HTTP calls'
      ],
      correct: 1,
      explanation: 'Idempotent consumers use event deduplication caches or transactional constraints to ensure repeated delivery does not produce side effects.'
    },
    {
      id: 2,
      question: 'What is the primary architectural trade-off when selecting Raft consensus over classic multi-Paxos?',
      options: [
        'Raft provides higher write throughput on geodistributed WAN connections',
        'Raft decomposes consensus into explicit, understandable states (Leader Election & Log Replication)',
        'Raft completely eliminates network round-trips for quorum validation',
        'Raft requires zero non-volatile disk persistence'
      ],
      correct: 1,
      explanation: 'Raft was explicitly designed for human understandability, enforcing strong leader invariants to simplify state machine replication.'
    },
    {
      id: 3,
      question: 'Under high network partition failure, why is Redis Redlock debated compared to CP systems like etcd?',
      options: [
        'Redis is too performant for distributed consensus locks',
        'Redlock relies on synchronized system clocks which can drift under NTP jumps or process pauses',
        'Redis cannot store JSON string payloads',
        'Redlock requires at least 50 cluster nodes'
      ],
      correct: 1,
      explanation: 'Martin Kleppmann proved that clock skew and garbage collection pauses can invalidate Redlock TTL assumptions without fencing tokens.'
    }
  ];

  const handleSelectQuizAnswer = (qIndex: number, optionIndex: number) => {
    if (!quizSubmitted) {
      setQuizAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
    }
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  useEffect(() => {
    setNoteContent(userNotes[activeLecture?.id || ''] || '');
  }, [activeLecture?.id, userNotes]);

  const handleInsertTimestamp = (ts: string) => {
    const formatted = `\n[${ts}] `;
    setNoteContent((prev) => (prev ? `${prev}${formatted}` : `[${ts}] `));
  };

  const handleExportNotesMarkdown = () => {
    let md = `# ${course.title} — Architectural Course Notes\n`;
    md += `**Learner:** ${user?.name || 'Alex Rivera'}\n`;
    md += `**Export Date:** ${new Date().toLocaleDateString()}\n`;
    md += `**Curriculum Progress:** ${enrollment?.progressPercentage || 0}%\n\n`;
    md += `----\n\n`;

    let notesFound = 0;
    course.sections.forEach((section, sIdx) => {
      let sectionHasNotes = false;
      let sectionMd = `## Section ${sIdx + 1}: ${section.title}\n\n`;

      section.lectures.forEach((lec) => {
        const text = lec.id === activeLecture?.id ? noteContent : userNotes[lec.id];
        if (text && text.trim()) {
          sectionHasNotes = true;
          notesFound++;
          sectionMd += `### ${lec.title} (${lec.duration})\n`;
          sectionMd += `${text.trim()}\n\n`;
        }
      });

      if (sectionHasNotes) {
        md += sectionMd;
      }
    });

    if (notesFound === 0) {
      md += `*No notes have been recorded for this course yet.*\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${course.title.replace(/[^a-zA-Z0-9]/g, '_')}_Notes.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveNote = () => {
    if (activeLecture) {
      saveNote(activeLecture.id, noteContent);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2000);
    }
  };

  const handleMarkCompleteAndNext = () => {
    if (activeLecture) {
      markLectureComplete(course.id, activeLecture.id);
      const nextLecture = allLectures[currentLectureIndex + 1];
      if (nextLecture) {
        navigate(`/learn/${course.id}/lecture/${nextLecture.id}`);
      } else {
        // Completed entire course!
        navigate(`/certificates/${course.id}`);
      }
    }
  };

  const handleSelectLecture = (lecId: string) => {
    navigate(`/learn/${course.id}/lecture/${lecId}`);
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQTitle.trim()) return;

    const newQuestion: CourseQuestion = {
      id: `q-${Date.now()}`,
      courseId: course.id,
      lectureId: activeLecture?.id,
      lectureTitle: activeLecture?.title,
      userId: user?.id || 'user-student-1',
      userName: user?.name || 'Verified Student',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: newQTitle.trim(),
      content: newQContent.trim(),
      createdAt: 'Just now',
      upvotes: 1,
      hasInstructorReplied: false,
      answers: []
    };

    addQuestion(newQuestion);
    setNewQTitle('');
    setNewQContent('');
    setIsAskingQuestion(false);
    setQaNotice('Your question was posted to the course architectural forum.');
    setTimeout(() => setQaNotice(''), 3500);
  };

  const handleSubmitAnswer = (questionId: string) => {
    if (!replyContent.trim()) return;

    const newAnswer: CourseAnswer = {
      id: `ans-${Date.now()}`,
      questionId,
      userId: user?.id || 'user-student-1',
      userName: user?.name || 'Verified Student',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      userRole: user?.role || 'student',
      text: replyContent.trim(),
      createdAt: 'Just now',
      isInstructorAnswer: user?.role === 'instructor'
    };

    addAnswer(questionId, newAnswer);
    setReplyingToId(null);
    setReplyContent('');
    setQaNotice('Your response was added to the discussion thread.');
    setTimeout(() => setQaNotice(''), 3500);
  };

  const courseQuestions = questions.filter((q) => q.courseId === course.id);
  const filteredQuestions = courseQuestions.filter((q) => {
    const matchesScope = qaScope === 'all' || q.lectureId === activeLecture?.id;
    const matchesSearch =
      !qaSearch ||
      q.title.toLowerCase().includes(qaSearch.toLowerCase()) ||
      q.content.toLowerCase().includes(qaSearch.toLowerCase()) ||
      q.userName.toLowerCase().includes(qaSearch.toLowerCase());
    return matchesScope && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-bg-canvas flex flex-col">
      {/* Top Player Focus Header */}
      <div className="w-full bg-surface-container-lowest border-b border-border-standard px-4 sm:px-6 lg:px-8 py-3.5 shadow-md">
        <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Back & Breadcrumb */}
          <div className="flex items-center gap-3.5 min-w-0">
            <Link
              to="/my-courses"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-secondary hover:text-text-contrast transition-all shrink-0"
              title="Return to My Learning"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
                  Curriculum Path
                </span>
                <span className="text-text-muted text-xs">•</span>
                <span className="text-[11px] font-mono text-primary font-medium truncate">
                  {course.title}
                </span>
              </div>
              <h1 className="text-xs sm:text-sm font-semibold text-text-contrast truncate mt-0.5">
                {activeLecture?.title || 'Active Lecture'}
              </h1>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="hidden xl:flex items-center gap-3 px-4 py-1.5 rounded-lg bg-surface-container-low min-w-[280px]">
            <div className="flex flex-col flex-1 gap-1">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-text-muted">Total Completion</span>
                <span className="text-text-contrast font-bold">
                  {enrollment?.progressPercentage || 0}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-container rounded-full transition-all duration-500"
                  style={{ width: `${enrollment?.progressPercentage || 0}%` }}
                ></div>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary-container text-[18px]">
              verified
            </span>
          </div>

          {/* Player Nav Controls */}
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
            {currentLectureIndex > 0 && (
              <button
                onClick={() =>
                  navigate(
                    `/learn/${course.id}/lecture/${allLectures[currentLectureIndex - 1].id}`
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-secondary hover:text-text-contrast text-xs transition-colors"
              >
                <span className="material-symbols-outlined text-base">skip_previous</span>
                <span className="hidden sm:inline">Previous</span>
              </button>
            )}

            <button
              onClick={handleMarkCompleteAndNext}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 text-white text-xs font-semibold transition-all shadow-md"
            >
              <span>{currentLectureIndex === allLectures.length - 1 ? 'Finish & Claim Certificate' : 'Complete & Next'}</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace (Stage + Curriculum Drawer) */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Stage Area (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Player Container */}
            <div className="relative w-full bg-surface-card border border-border-standard rounded-2xl overflow-hidden shadow-2xl">
              {activeLecture?.contentType === 'video' ? (
                /* Video Player */
                <div className="relative aspect-video w-full bg-black flex flex-col justify-between">
                  <video
                    key={activeLecture.id}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                    src={activeLecture.contentUrl}
                  />

                  {/* Playback speed selector overlay in video player controls */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] font-mono text-white">
                    <span>Speed:</span>
                    {[1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => setPlaybackSpeed(s)}
                        className={`px-1.5 py-0.5 rounded ${
                          playbackSpeed === s ? 'bg-primary-container text-white font-bold' : 'hover:bg-white/20'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* PDF Interactive Lecture Viewer */
                <div className="min-h-[480px] bg-surface-secondary flex flex-col">
                  {/* PDF Toolbar */}
                  <div className="px-4 py-2.5 bg-surface-container-lowest border-b border-border-subtle flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base">picture_as_pdf</span>
                      <span className="font-semibold text-text-contrast">{activeLecture?.title}</span>
                      <span className="text-[11px] font-mono text-text-muted">({activeLecture?.duration})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPdfZoom((z) => Math.max(75, z - 15))}
                        className="p-1 rounded hover:bg-surface-interactive text-text-muted hover:text-text-primary"
                        title="Zoom Out"
                      >
                        <span className="material-symbols-outlined text-base">zoom_out</span>
                      </button>
                      <span className="font-mono text-[11px] text-text-muted">{pdfZoom}%</span>
                      <button
                        onClick={() => setPdfZoom((z) => Math.min(150, z + 15))}
                        className="p-1 rounded hover:bg-surface-interactive text-text-muted hover:text-text-primary"
                        title="Zoom In"
                      >
                        <span className="material-symbols-outlined text-base">zoom_in</span>
                      </button>

                      {activeLecture?.pdfDownloadable && (
                        <a
                          href={activeLecture.contentUrl}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="ml-3 flex items-center gap-1 px-2.5 py-1 rounded bg-surface-interactive hover:bg-surface-elevated text-text-primary text-[11px] font-semibold border border-border-control transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">download</span>
                          <span>Download PDF</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Rendered PDF Mock Document Stage */}
                  <div className="p-8 flex-1 flex items-center justify-center bg-surface-container-low overflow-auto">
                    <div
                      style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: 'top center' }}
                      className="w-full max-w-2xl bg-surface-card border border-border-standard rounded-xl p-8 space-y-4 shadow-xl transition-transform"
                    >
                      <div className="flex justify-between items-center pb-3 border-b border-border-subtle font-mono text-[11px] text-text-muted">
                        <span>OBSIDIAN ARCHITECTURE BLUEPRINT #04</span>
                        <span>PAGE 1 OF 24</span>
                      </div>
                      <h2 className="text-xl font-bold text-text-contrast font-display">
                        Transactional Outbox Pattern & Microservice State Synchrony
                      </h2>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        In high-throughput microservices, coordinating database state transitions with distributed message brokers introduces dual-write anomalies. The Transactional Outbox pattern circumvents this by atomically appending outgoing messages to a dedicated SQL table within the business database transaction.
                      </p>
                      <div className="bg-surface-secondary p-4 rounded-lg font-mono text-xs text-primary leading-relaxed border border-border-control">
                        <code>
                          INSERT INTO outbox_events (event_id, event_type, payload, status)<br />
                          VALUES (:uuid, 'ORDER_CONFIRMED', :json_payload, 'PENDING');
                        </code>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        A dedicated background CDC (Change Data Capture) poller or Debezium connector streams these recorded events to the Apache Kafka cluster with zero message loss and at-least-once delivery guarantees.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lecture Workspace Tabs */}
            <div className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-6">
              {/* Tab Buttons */}
              <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-surface-interactive text-text-contrast border border-border-control'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  Overview & Summary
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'notes'
                      ? 'bg-surface-interactive text-text-contrast border border-border-control'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">edit_note</span>
                  <span>My Notes</span>
                </button>
                <button
                  onClick={() => setActiveTab('qa')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'qa'
                      ? 'bg-surface-interactive text-text-contrast border border-border-control'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  Q&A Discussion (4)
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'resources'
                      ? 'bg-surface-interactive text-text-contrast border border-border-control'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  Resources & Downloads
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'quiz'
                      ? 'bg-primary-container text-white shadow-sm font-bold'
                      : 'text-text-muted hover:text-text-primary hover:bg-surface-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">quiz</span>
                  <span>Practice Quiz</span>
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'overview' && (
                <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
                  <h3 className="text-sm font-semibold text-text-contrast">
                    {activeLecture?.title}
                  </h3>
                  <p>
                    {activeLecture?.summary ||
                      'In this lecture, we review production design patterns, Kafka stream configurations, and idempotency guarantees using NestJS CQRS decorators and Redis distributed locks.'}
                  </p>
                  <div className="p-3 rounded-lg bg-surface-secondary border border-border-subtle flex items-center gap-2 text-text-muted font-mono text-[11px]">
                    <span className="material-symbols-outlined text-primary text-sm">info</span>
                    <span>All code examples can be cloned from the official GitHub workspace repo.</span>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  {/* Top Bar for Notes */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
                    <div className="flex items-center gap-1.5 bg-surface-secondary p-1 rounded-xl border border-border-control">
                      <button
                        onClick={() => setNotesViewMode('active')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          notesViewMode === 'active'
                            ? 'bg-surface-elevated text-text-contrast border border-border-control shadow-sm'
                            : 'text-text-muted hover:text-text-primary'
                        }`}
                      >
                        Current Lecture Notes
                      </button>
                      <button
                        onClick={() => setNotesViewMode('digest')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                          notesViewMode === 'digest'
                            ? 'bg-surface-elevated text-text-contrast border border-border-control shadow-sm'
                            : 'text-text-muted hover:text-text-primary'
                        }`}
                      >
                        <span>All Course Notes</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-primary-container/20 text-primary text-[10px] font-mono font-bold">
                          {Object.keys(userNotes).filter((k) => userNotes[k]?.trim()).length}
                        </span>
                      </button>
                    </div>

                    <button
                      onClick={handleExportNotesMarkdown}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-surface-elevated text-text-primary border border-border-control text-xs font-mono transition-colors self-start sm:self-auto shadow-sm"
                      title="Download all course notes as a Markdown (.md) file"
                    >
                      <span className="material-symbols-outlined text-sm text-primary">download</span>
                      <span>Export Notes (.md)</span>
                    </button>
                  </div>

                  {notesViewMode === 'active' ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs text-text-muted font-mono truncate max-w-sm">
                          Notes for {activeLecture?.title}:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleInsertTimestamp('03:45')}
                            className="px-2.5 py-1 rounded-lg bg-surface-secondary hover:bg-surface-elevated text-primary text-[11px] font-mono border border-border-control flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-xs">schedule</span>
                            <span>+ Insert [03:45]</span>
                          </button>
                          {noteSaved && (
                            <span className="text-xs text-status-success font-mono">✓ Saved to cloud</span>
                          )}
                        </div>
                      </div>
                      <textarea
                        rows={6}
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Write private architectural notes, timestamps, or key takeaways..."
                        className="w-full bg-surface-secondary border border-border-control rounded-xl p-4 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container font-mono"
                      ></textarea>
                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveNote}
                          className="px-4 py-2 rounded-lg bg-primary-container hover:brightness-110 text-white text-xs font-semibold transition-all shadow-sm"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* All Course Notes Digest View */
                    <div className="space-y-4">
                      {course.sections.map((section, sIdx) => {
                        const sectionLecturesWithNotes = section.lectures.filter((lec) => {
                          const text = lec.id === activeLecture?.id ? noteContent : userNotes[lec.id];
                          return text && text.trim();
                        });

                        if (sectionLecturesWithNotes.length === 0) return null;

                        return (
                          <div
                            key={section.id}
                            className="bg-surface-secondary/40 border border-border-subtle rounded-xl p-4 space-y-3"
                          >
                            <h4 className="text-xs font-bold text-text-contrast uppercase font-mono tracking-wider flex items-center gap-2">
                              <span className="text-primary">Section {sIdx + 1}:</span>
                              <span>{section.title}</span>
                            </h4>

                            <div className="space-y-2">
                              {sectionLecturesWithNotes.map((lec) => {
                                const text = lec.id === activeLecture?.id ? noteContent : userNotes[lec.id];
                                return (
                                  <div
                                    key={lec.id}
                                    className="p-3 bg-surface-card border border-border-standard rounded-lg space-y-2"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm text-text-muted">
                                          edit_note
                                        </span>
                                        <span className="text-xs font-semibold text-text-contrast">
                                          {lec.title}
                                        </span>
                                      </div>
                                      <button
                                        onClick={() => handleSelectLecture(lec.id)}
                                        className="text-[11px] font-mono text-primary hover:underline flex items-center gap-1"
                                      >
                                        <span>Jump to lecture</span>
                                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                      </button>
                                    </div>
                                    <div className="text-xs text-text-secondary font-mono whitespace-pre-wrap bg-surface-secondary/60 p-2.5 rounded border border-border-subtle">
                                      {text}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}

                      {Object.keys(userNotes).filter((k) => userNotes[k]?.trim()).length === 0 &&
                        !noteContent.trim() && (
                          <div className="p-8 text-center text-text-muted bg-surface-secondary/20 rounded-xl border border-border-subtle">
                            <span className="material-symbols-outlined text-3xl mb-1 text-text-muted/60 block">
                              note_stack
                            </span>
                            <p className="text-xs">No notes recorded in this course yet.</p>
                            <p className="text-[11px] text-text-muted mt-1">
                              Switch to Current Lecture Notes to jot down insights.
                            </p>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'qa' && (
                <div className="space-y-5 text-xs">
                  {/* Top QA Actions Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-contrast text-sm">
                        Course Q&A & Community Discussion
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary text-[10px] font-mono font-bold">
                        {courseQuestions.length} Questions
                      </span>
                    </div>

                    <button
                      onClick={() => setIsAskingQuestion(!isAskingQuestion)}
                      className="px-3 py-1.5 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 text-white text-xs font-semibold transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isAskingQuestion ? 'close' : 'add_comment'}
                      </span>
                      <span>{isAskingQuestion ? 'Cancel Question' : 'Ask a Question'}</span>
                    </button>
                  </div>

                  {qaNotice && (
                    <div className="p-3 rounded-xl bg-status-success/10 border border-status-success/30 text-status-success text-xs flex items-center gap-2 animate-fade-in font-medium">
                      <span className="material-symbols-outlined text-base">verified</span>
                      <span>{qaNotice}</span>
                    </div>
                  )}

                  {/* Ask Question Form */}
                  {isAskingQuestion && (
                    <form onSubmit={handleSubmitQuestion} className="p-4 rounded-2xl bg-surface-secondary border border-primary-container/40 space-y-3 animate-fade-in shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-primary uppercase">
                          New Architectural Question
                        </span>
                        <span className="text-[10px] text-text-muted font-mono">
                          Linked to: {activeLecture?.title.slice(0, 30)}...
                        </span>
                      </div>

                      <input
                        type="text"
                        required
                        value={newQTitle}
                        onChange={(e) => setNewQTitle(e.target.value)}
                        placeholder="State your question concisely (e.g. How to handle Kafka consumer rebalancing with outbox?)"
                        className="w-full bg-surface-card border border-border-control rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary-container"
                      />

                      <textarea
                        rows={3}
                        required
                        value={newQContent}
                        onChange={(e) => setNewQContent(e.target.value)}
                        placeholder="Provide architectural context, code snippet, error trace, or trade-off consideration..."
                        className="w-full bg-surface-card border border-border-control rounded-lg p-3 text-text-primary font-mono focus:outline-none focus:border-primary-container"
                      ></textarea>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAskingQuestion(false)}
                          className="px-3 py-1.5 rounded-lg bg-surface-card border border-border-control text-text-muted hover:text-text-contrast"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-primary-container hover:brightness-110 text-white font-semibold shadow-md flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">send</span>
                          <span>Post to Cohort</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Filter and Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-xl border border-border-control text-xs w-full sm:w-auto">
                      <button
                        onClick={() => setQaScope('all')}
                        className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg font-medium transition-all ${
                          qaScope === 'all'
                            ? 'bg-primary-container text-white shadow-sm font-semibold'
                            : 'text-text-muted hover:text-text-contrast'
                        }`}
                      >
                        All Course Questions ({courseQuestions.length})
                      </button>
                      <button
                        onClick={() => setQaScope('lecture')}
                        className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg font-medium transition-all ${
                          qaScope === 'lecture'
                            ? 'bg-primary-container text-white shadow-sm font-semibold'
                            : 'text-text-muted hover:text-text-contrast'
                        }`}
                      >
                        Current Lecture Only
                      </button>
                    </div>

                    <div className="w-full sm:w-64 relative">
                      <span className="material-symbols-outlined absolute left-2.5 top-2 text-text-muted text-sm">
                        search
                      </span>
                      <input
                        type="text"
                        value={qaSearch}
                        onChange={(e) => setQaSearch(e.target.value)}
                        placeholder="Search questions..."
                        className="w-full bg-surface-secondary border border-border-control rounded-lg pl-8 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container"
                      />
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-4 pt-1">
                    {filteredQuestions.length > 0 ? (
                      filteredQuestions.map((q) => (
                        <div
                          key={q.id}
                          className="p-4 rounded-2xl bg-surface-secondary border border-border-subtle hover:border-border-control transition-all space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={q.userAvatar}
                                alt={q.userName}
                                className="w-7 h-7 rounded-full object-cover ring-1 ring-border-control shrink-0"
                              />
                              <div>
                                <div className="font-semibold text-text-contrast text-xs flex items-center gap-2">
                                  <span>{q.userName}</span>
                                  {q.lectureTitle && (
                                    <span className="text-[10px] font-mono text-primary px-1.5 py-0.2 rounded bg-primary-container/15 truncate max-w-[180px]">
                                      {q.lectureTitle.split('—')[0]}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-text-muted font-mono">{q.createdAt}</span>
                              </div>
                            </div>

                            {/* Upvote Button */}
                            <button
                              onClick={() => upvoteQuestion(q.id)}
                              className="px-2.5 py-1 rounded-lg bg-surface-card hover:bg-surface-interactive border border-border-control text-text-muted hover:text-primary text-[11px] font-mono transition-colors flex items-center gap-1 shrink-0"
                              title="Upvote question"
                            >
                              <span className="material-symbols-outlined text-xs">arrow_upward</span>
                              <span className="font-bold">{q.upvotes}</span>
                            </button>
                          </div>

                          {/* Question Text */}
                          <div className="space-y-1 pl-9">
                            <h4 className="font-bold text-text-contrast text-xs leading-snug">
                              {q.title}
                            </h4>
                            <p className="text-text-secondary text-xs leading-relaxed">
                              {q.content}
                            </p>
                          </div>

                          {/* Answers Thread */}
                          {q.answers.length > 0 && (
                            <div className="ml-9 space-y-2 pt-1 border-t border-border-subtle">
                              <span className="text-[10px] font-mono uppercase text-text-muted">
                                {q.answers.length} {q.answers.length === 1 ? 'Response' : 'Responses'}:
                              </span>
                              {q.answers.map((ans) => (
                                <div
                                  key={ans.id}
                                  className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                                    ans.isInstructorAnswer
                                      ? 'bg-primary-container/10 border-primary-container/30'
                                      : 'bg-surface-card border-border-subtle'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={ans.userAvatar}
                                        alt={ans.userName}
                                        className="w-5 h-5 rounded-full object-cover"
                                      />
                                      <span className="font-semibold text-text-contrast text-[11px]">
                                        {ans.userName}
                                      </span>
                                      {ans.isInstructorAnswer && (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary-container text-white text-[9px] font-mono font-bold">
                                          <span className="material-symbols-outlined text-[10px]">verified</span>
                                          INSTRUCTOR
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-text-muted font-mono">{ans.createdAt}</span>
                                  </div>
                                  <p className="text-text-secondary text-[11px] leading-relaxed">
                                    {ans.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Form Trigger */}
                          <div className="ml-9 pt-1 flex items-center justify-between">
                            {replyingToId === q.id ? (
                              <div className="w-full space-y-2 pt-2 animate-fade-in">
                                <textarea
                                  rows={2}
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder="Write a constructive answer or architectural follow-up..."
                                  className="w-full bg-surface-card border border-border-control rounded-lg p-2.5 text-xs text-text-primary focus:outline-none focus:border-primary-container font-mono"
                                ></textarea>
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => setReplyingToId(null)}
                                    className="px-2.5 py-1 rounded bg-surface-card border border-border-control text-text-muted hover:text-text-contrast text-[11px]"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleSubmitAnswer(q.id)}
                                    className="px-3 py-1 rounded bg-primary-container hover:brightness-110 text-white font-semibold text-[11px] shadow-sm flex items-center gap-1"
                                  >
                                    <span className="material-symbols-outlined text-xs">send</span>
                                    <span>Post Response</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setReplyingToId(q.id);
                                  setReplyContent('');
                                }}
                                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-xs">reply</span>
                                <span>Contribute Answer</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center bg-surface-secondary/40 rounded-xl border border-border-subtle text-text-muted text-xs">
                        No questions found matching your filter criteria. Be the first to ask!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary border border-border-subtle">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base">terminal</span>
                      <span className="font-mono text-text-contrast">nestjs-kafka-outbox-lab.zip</span>
                    </div>
                    <button className="px-3 py-1 rounded bg-surface-interactive hover:bg-surface-elevated text-text-primary text-[11px] font-semibold">
                      Download (4.2 MB)
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary border border-border-subtle">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base">picture_as_pdf</span>
                      <span className="font-mono text-text-contrast">Distributed-Systems-Whitepaper.pdf</span>
                    </div>
                    <button className="px-3 py-1 rounded bg-surface-interactive hover:bg-surface-elevated text-text-primary text-[11px] font-semibold">
                      Download (1.8 MB)
                    </button>
                  </div>
                </div>
              )}

              {/* Architecture Quiz & Knowledge Check Tab */}
              {activeTab === 'quiz' && (
                <div className="space-y-6 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-status-warning font-bold">
                        Verification Examination
                      </span>
                      <h3 className="text-sm font-bold text-text-contrast mt-0.5">
                        Interactive Knowledge Check & Practice Test
                      </h3>
                      <p className="text-text-muted text-[11px] mt-0.5">
                        Answer all architectural questions to validate competency for the verifiable certificate.
                      </p>
                    </div>

                    {quizSubmitted && (
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-xs flex items-center gap-1.5 ${
                            quizScore === QUIZ_QUESTIONS.length
                              ? 'bg-status-success/15 border-status-success/40 text-status-success'
                              : 'bg-status-warning/15 border-status-warning/40 text-status-warning'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {quizScore === QUIZ_QUESTIONS.length ? 'verified' : 'analytics'}
                          </span>
                          <span>
                            Score: {quizScore} / {QUIZ_QUESTIONS.length} ({Math.round((quizScore / QUIZ_QUESTIONS.length) * 100)}%)
                          </span>
                        </div>
                        <button
                          onClick={handleRetakeQuiz}
                          className="px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-surface-interactive text-text-primary border border-border-standard text-xs font-medium transition-colors"
                        >
                          Retake Test
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Questions List */}
                  <div className="space-y-6">
                    {QUIZ_QUESTIONS.map((q, qIdx) => {
                      const isSelected = quizAnswers[qIdx] !== undefined;
                      const chosen = quizAnswers[qIdx];
                      const isCorrect = chosen === q.correct;

                      return (
                        <div
                          key={q.id}
                          className={`p-4 sm:p-5 rounded-xl border transition-all ${
                            quizSubmitted
                              ? isCorrect
                                ? 'bg-status-success/5 border-status-success/30'
                                : 'bg-status-danger/5 border-status-danger/30'
                              : 'bg-surface-secondary border-border-subtle'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-md bg-surface-card border border-border-standard font-mono font-bold text-[11px] flex items-center justify-center text-primary shrink-0">
                              {qIdx + 1}
                            </span>
                            <div className="flex-1 space-y-3">
                              <h4 className="font-semibold text-text-contrast text-xs sm:text-sm leading-relaxed">
                                {q.question}
                              </h4>

                              {/* Options */}
                              <div className="space-y-2 pt-1">
                                {q.options.map((opt, optIdx) => {
                                  const isOptionChosen = chosen === optIdx;
                                  const isOptionCorrect = q.correct === optIdx;

                                  let optionStyle =
                                    'bg-surface-card border-border-standard text-text-secondary hover:border-primary-container hover:text-text-contrast';

                                  if (quizSubmitted) {
                                    if (isOptionCorrect) {
                                      optionStyle =
                                        'bg-status-success/20 border-status-success text-status-success font-semibold';
                                    } else if (isOptionChosen && !isCorrect) {
                                      optionStyle =
                                        'bg-status-danger/20 border-status-danger text-status-danger line-through';
                                    } else {
                                      optionStyle = 'bg-surface-card border-border-subtle text-text-muted opacity-60';
                                    }
                                  } else if (isOptionChosen) {
                                    optionStyle =
                                      'bg-primary-container/20 border-primary-container text-text-contrast font-medium';
                                  }

                                  return (
                                    <button
                                      key={optIdx}
                                      type="button"
                                      disabled={quizSubmitted}
                                      onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                                      className={`w-full p-3 rounded-lg border text-left text-xs transition-all flex items-center gap-3 ${optionStyle}`}
                                    >
                                      <div
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                          isOptionChosen
                                            ? 'border-primary-container bg-primary-container text-white'
                                            : 'border-border-control'
                                        }`}
                                      >
                                        {isOptionChosen && (
                                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                        )}
                                      </div>
                                      <span className="flex-1">{opt}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Explanation when submitted */}
                              {quizSubmitted && (
                                <div
                                  className={`p-3 rounded-lg text-[11px] leading-relaxed mt-2 border ${
                                    isCorrect
                                      ? 'bg-status-success/10 border-status-success/20 text-status-success'
                                      : 'bg-status-danger/10 border-status-danger/20 text-text-secondary'
                                  }`}
                                >
                                  <strong>{isCorrect ? '✓ Correct! ' : '✕ Incorrect. '}</strong>
                                  {q.explanation}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Submission Action */}
                  {!quizSubmitted && (
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                        className="px-6 py-2.5 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 text-white font-bold text-xs transition-all shadow-md disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">send</span>
                        <span>Submit Architecture Answers</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Curriculum Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-surface-card border border-border-standard rounded-2xl p-5 space-y-4 sticky top-20 shadow-xl max-h-[82vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <span className="text-xs font-semibold text-text-contrast uppercase tracking-wider font-mono">
                Course Curriculum
              </span>
              <span className="text-[11px] font-mono text-text-muted">
                {completedIds.length}/{allLectures.length} Finished
              </span>
            </div>

            {/* Sections List */}
            <div className="space-y-4">
              {course.sections.map((section) => (
                <div key={section.id} className="space-y-2">
                  <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider font-mono px-1">
                    {section.title}
                  </div>

                  <div className="space-y-1">
                    {section.lectures.map((lec) => {
                      const isCurrent = lec.id === activeLecture?.id;
                      const isCompleted = completedIds.includes(lec.id);

                      return (
                        <button
                          key={lec.id}
                          onClick={() => handleSelectLecture(lec.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-all ${
                            isCurrent
                              ? 'bg-surface-interactive text-text-contrast border-l-2 border-primary-container font-semibold shadow-sm'
                              : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {isCompleted ? (
                              <span className="material-symbols-outlined text-status-success text-base shrink-0">
                                check_circle
                              </span>
                            ) : (
                              <span
                                className={`material-symbols-outlined text-base shrink-0 ${
                                  isCurrent ? 'text-primary-container' : 'text-text-muted'
                                }`}
                              >
                                {lec.contentType === 'video' ? 'play_circle' : 'description'}
                              </span>
                            )}
                            <span className="truncate">{lec.title}</span>
                          </div>

                          <span className="text-[10px] font-mono text-text-muted shrink-0 ml-2">
                            {lec.duration}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
