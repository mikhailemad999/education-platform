import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourseStore, useLearningStore } from '../../store';

export const LearningPlayerPage: React.FC = () => {
  const { courseId, lectureId } = useParams<{ courseId: string; lectureId: string }>();
  const navigate = useNavigate();

  const getCourseById = useCourseStore((state) => state.getCourseById);
  const courses = useCourseStore((state) => state.courses);
  const course = getCourseById(courseId || 'course-1') || courses[0];

  const enrollments = useLearningStore((state) => state.enrollments);
  const markLectureComplete = useLearningStore((state) => state.markLectureComplete);
  const saveNote = useLearningStore((state) => state.saveNote);
  const userNotes = useLearningStore((state) => state.userNotes);

  const enrollment = enrollments.find((e) => e.courseId === course.id);
  const completedIds = enrollment?.completedLectureIds || [];

  // Flatten all lectures to navigate prev/next
  const allLectures = course.sections.flatMap((s) => s.lectures);
  const currentLectureIndex = allLectures.findIndex((l) => l.id === lectureId);
  const activeLecture = allLectures[currentLectureIndex >= 0 ? currentLectureIndex : 0];

  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'qa' | 'resources' | 'quiz'>('overview');
  const [noteContent, setNoteContent] = useState(userNotes[activeLecture?.id || ''] || '');
  const [noteSaved, setNoteSaved] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [pdfZoom, setPdfZoom] = useState(100);

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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted font-mono">
                      Personal notes for {activeLecture?.title}:
                    </span>
                    {noteSaved && (
                      <span className="text-xs text-status-success font-mono">✓ Saved to cloud</span>
                    )}
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
              )}

              {activeTab === 'qa' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Ask the instructor or fellow architects a question..."
                      className="w-full bg-surface-secondary border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-xl bg-surface-secondary border border-border-subtle space-y-1.5">
                      <div className="flex justify-between items-center text-text-muted text-[11px]">
                        <span className="font-semibold text-text-contrast">Marcus Chen</span>
                        <span className="font-mono">2 days ago</span>
                      </div>
                      <p className="text-text-secondary">
                        How does the outbox table handle cleanup when event volume exceeds 10M rows daily?
                      </p>
                      <div className="mt-2 pl-3 border-l-2 border-primary-container text-text-muted space-y-1">
                        <span className="text-[11px] font-semibold text-primary">Dr. Marcus Vance (Instructor)</span>
                        <p className="text-[11px]">
                          We implement range partitioning by date and drop expired partitions nightly, avoiding row-by-row deletes.
                        </p>
                      </div>
                    </div>
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
