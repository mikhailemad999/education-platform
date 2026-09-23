import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourseStore, useCartStore, useLearningStore } from '../../store';
import { MOCK_REVIEWS } from '../../services/mockData';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getCourseById = useCourseStore((state) => state.getCourseById);
  const setItem = useCartStore((state) => state.setItem);
  const setActiveLesson = useLearningStore((state) => state.setActiveLesson);

  const course = getCourseById(id || 'course-1') || useCourseStore((state) => state.courses[0]);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'sec-1': true,
    'sec-2': true
  });
  const [isPlayingPromo, setIsPlayingPromo] = useState(false);

  const toggleSection = (secId: string) => {
    setExpandedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  const handleEnroll = () => {
    setItem({ course, price: course.price });
    navigate('/checkout');
  };

  const handlePreviewLecture = (lectureId: string) => {
    setActiveLesson(course.id, lectureId);
    navigate(`/learn/${course.id}/lecture/${lectureId}`);
  };

  const totalLectures = course.sections.reduce((acc, s) => acc + s.lectures.length, 0);

  return (
    <div className="w-full">
      {/* Course Hero Bar */}
      <section className="relative w-full bg-surface-container-lowest border-b border-border-standard py-10 px-4 sm:px-6 lg:px-8">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-4 font-mono">
            <Link to="/" className="hover:text-text-primary transition-colors">Courses</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link to="/search" className="hover:text-text-primary transition-colors">{course.categoryName}</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-text-contrast truncate max-w-xs">{course.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/15 text-primary text-[11px] font-mono font-bold">
                  <span className="material-symbols-outlined text-xs">local_fire_department</span>
                  SYSTEMS MASTERCLASS
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-text-secondary text-[11px] font-mono">
                  <span className="material-symbols-outlined text-xs">update</span>
                  Updated 2025
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-success/10 text-status-success text-[11px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span>
                  Hands-on Lab Included
                </span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-text-contrast tracking-tight leading-tight">
                {course.title}
              </h1>
              <p className="text-base text-text-secondary leading-relaxed max-w-3xl">
                {course.subtitle}
              </p>

              {/* Rating & Stats Strip */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                <div className="flex items-center gap-1.5 text-status-warning font-bold">
                  <span className="text-sm">{course.rating.toFixed(2)}</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-text-muted font-normal">({course.reviewCount.toLocaleString()} ratings)</span>
                </div>
                <span className="text-text-muted">•</span>
                <div className="text-text-secondary">
                  <strong className="text-text-contrast font-semibold">{course.enrolledStudents.toLocaleString()}</strong> engineers enrolled
                </div>
                <span className="text-text-muted">•</span>
                <div className="text-text-muted">
                  Created by <span className="text-text-primary underline cursor-pointer">{course.instructorName}</span>
                </div>
              </div>

              {/* Mobile Purchase Trigger (visible only on small screens) */}
              <div className="lg:hidden p-4 rounded-xl bg-surface-card border border-border-standard mt-4 space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-text-contrast">${course.price.toFixed(2)}</span>
                  <span className="text-sm text-text-muted line-through font-mono">${course.originalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleEnroll}
                  className="w-full h-11 rounded-lg bg-primary-container hover:brightness-110 text-white font-semibold text-xs transition-all shadow-md"
                >
                  Enroll Now
                </button>
              </div>
            </div>

            {/* Desktop Sticky Purchase Card (4 cols) */}
            <div className="hidden lg:block lg:col-span-4 sticky top-28">
              <div className="bg-surface-card border border-border-standard rounded-2xl overflow-hidden shadow-2xl">
                {/* Video Trailer Thumbnail */}
                <div className="relative aspect-video w-full bg-surface-secondary overflow-hidden">
                  {isPlayingPromo ? (
                    <video
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      src={course.promoVideoUrl}
                    />
                  ) : (
                    <>
                      <img
                        src={course.thumbnail}
                        alt="Promo preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                        <button
                          onClick={() => setIsPlayingPromo(true)}
                          className="w-14 h-14 rounded-full bg-primary-container text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-xl"
                        >
                          <span className="material-symbols-outlined text-3xl ml-1">play_arrow</span>
                        </button>
                        <span className="text-xs font-semibold text-text-contrast mt-2 drop-shadow">
                          Watch Architectural Preview
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Pricing & Checkout Form */}
                <div className="p-6 space-y-5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-text-contrast font-mono">
                      ${course.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-text-muted line-through font-mono">
                      ${course.originalPrice.toFixed(2)}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary-container/20 text-primary ml-auto">
                      40% OFF
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      onClick={handleEnroll}
                      className="w-full h-12 rounded-lg bg-primary-container hover:brightness-110 active:scale-[0.98] text-white text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Enroll in Masterclass</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                    <button
                      onClick={handleEnroll}
                      className="w-full h-11 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-primary text-xs font-semibold border border-border-control transition-colors"
                    >
                      Pay by Check / Corporate Invoice
                    </button>
                  </div>

                  <div className="text-center text-[11px] text-text-muted">
                    30-Day Money-Back Guarantee • Instant Access
                  </div>

                  {/* Course Includes Matrix */}
                  <div className="pt-4 border-t border-border-subtle space-y-2.5 text-xs text-text-secondary">
                    <div className="font-semibold text-text-contrast text-[11px] uppercase tracking-wider font-mono">
                      This masterclass includes:
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-primary text-base">ondemand_video</span>
                      <span>{course.duration} on-demand video</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-primary text-base">menu_book</span>
                      <span>Full syllabus & downloadable lab PDFs</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-primary text-base">verified</span>
                      <span>Verifiable cryptographic certificate</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-primary text-base">all_inclusive</span>
                      <span>Full lifetime access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Detail Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Details (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* What you'll learn */}
            <div className="bg-surface-card border border-border-standard rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-contrast mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">verified</span>
                What you'll master
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.whatYouWillLearn.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-status-success text-base shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span className="text-xs text-text-secondary leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Accordion */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div>
                  <h2 className="text-xl font-bold text-text-contrast">Course Curriculum</h2>
                  <p className="text-xs text-text-muted mt-0.5">
                    {course.sections.length} sections • {totalLectures} lectures • {course.duration} total length
                  </p>
                </div>
                <button
                  onClick={() => {
                    const allOpen = Object.keys(expandedSections).length === course.sections.length;
                    if (allOpen) {
                      setExpandedSections({});
                    } else {
                      const all: Record<string, boolean> = {};
                      course.sections.forEach((s) => (all[s.id] = true));
                      setExpandedSections(all);
                    }
                  }}
                  className="text-xs text-primary hover:underline font-mono"
                >
                  Expand / Collapse All
                </button>
              </div>

              {/* Sections list */}
              <div className="space-y-3">
                {course.sections.map((section) => {
                  const isOpen = !!expandedSections[section.id];
                  return (
                    <div
                      key={section.id}
                      className="bg-surface-card border border-border-standard rounded-xl overflow-hidden"
                    >
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-surface-interactive transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`material-symbols-outlined text-text-muted transition-transform ${
                              isOpen ? 'rotate-90' : ''
                            }`}
                          >
                            chevron_right
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-text-contrast">
                            {section.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-text-muted font-mono shrink-0">
                          {section.lectures.length} lectures
                        </span>
                      </button>

                      {/* Lectures list */}
                      {isOpen && (
                        <div className="border-t border-border-subtle divide-y divide-border-subtle bg-surface-container-lowest/50">
                          {section.lectures.map((lecture) => (
                            <div
                              key={lecture.id}
                              className="px-5 py-3 flex items-center justify-between text-xs hover:bg-surface-interactive/60 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="material-symbols-outlined text-text-muted text-base shrink-0">
                                  {lecture.contentType === 'video' ? 'play_circle' : 'description'}
                                </span>
                                <span className="text-text-secondary truncate">{lecture.title}</span>
                              </div>

                              <div className="flex items-center gap-3 shrink-0 ml-4">
                                {lecture.isPreview && (
                                  <button
                                    onClick={() => handlePreviewLecture(lecture.id)}
                                    className="px-2 py-0.5 rounded text-[10px] font-mono text-primary bg-primary-container/15 hover:bg-primary-container hover:text-white transition-colors"
                                  >
                                    Preview
                                  </button>
                                )}
                                <span className="text-[11px] text-text-muted font-mono">
                                  {lecture.duration}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-surface-card border border-border-standard rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-text-contrast mb-3">Prerequisites</h2>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-text-secondary">
                {course.prerequisites.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>

            {/* Instructor Bio */}
            <div className="bg-surface-card border border-border-standard rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-text-contrast mb-4">Instructor</h2>
              <div className="flex items-start gap-4">
                <img
                  src={course.instructorAvatar}
                  alt={course.instructorName}
                  className="w-16 h-16 rounded-xl object-cover ring-1 ring-border-standard shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-text-contrast">{course.instructorName}</h3>
                  <p className="text-xs text-primary font-mono">{course.instructorTitle}</p>
                  <p className="text-xs text-text-secondary leading-relaxed pt-2">
                    15+ years architecting hyper-scale distributed backends, author of high-throughput streaming systems, and passionate mentor for senior engineers leveling up to architects.
                  </p>
                </div>
              </div>
            </div>

            {/* Student Reviews */}
            <div className="bg-surface-card border border-border-standard rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <h2 className="text-lg font-bold text-text-contrast">Student Reviews</h2>
                <div className="flex items-center gap-1.5 text-status-warning font-bold text-sm">
                  <span>★ {course.rating.toFixed(2)}</span>
                  <span className="text-text-muted text-xs font-normal">course rating</span>
                </div>
              </div>

              <div className="space-y-6">
                {MOCK_REVIEWS.map((rev) => (
                  <div key={rev.id} className="space-y-2 pb-4 border-b border-border-subtle last:border-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-text-contrast">{rev.userName}</span>
                      </div>
                      <span className="text-[11px] text-text-muted font-mono">{rev.createdAt}</span>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed pl-9">
                      {rev.comment}
                    </p>

                    {rev.instructorReply && (
                      <div className="ml-9 p-3 rounded-lg bg-surface-secondary border border-border-subtle text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-primary text-[11px]">
                          <span className="material-symbols-outlined text-xs">reply</span>
                          <span>Instructor Response</span>
                        </div>
                        <p className="text-text-secondary text-[11px]">{rev.instructorReply.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
