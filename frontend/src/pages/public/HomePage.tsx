import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCourseStore, useCartStore } from '../../store';
import { CourseCard } from '../../components/common/CourseCard';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const courses = useCourseStore((state) => state.courses);
  const categories = useCourseStore((state) => state.categories);
  const setSelectedCategory = useCourseStore((state) => state.setSelectedCategory);
  const setItem = useCartStore((state) => state.setItem);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    navigate('/search');
  };

  const featuredCourse = courses[0];

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION WITH ASYMMETRIC CODE/STREAM CANVAS */}
      <section className="relative overflow-hidden pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-accent-ambient-subtle blur-[130px] pointer-events-none opacity-60"></div>
        <div className="absolute top-1/3 -right-24 w-[32rem] h-[32rem] rounded-full bg-accent-ambient-dark blur-[150px] pointer-events-none opacity-40"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high/70 backdrop-blur-md mb-6 shadow-sm border border-border-standard">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-text-primary">
                Engineering & Architecture Mastery
              </span>
              <span className="text-text-muted text-xs">•</span>
              <span className="text-[11px] font-mono text-primary-bright">v2.8 Production Syllabus</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-contrast tracking-tight mb-5 leading-tight">
              Learn faster.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-contrast via-white to-primary-container">
                Build real systems.
              </span><br />
              Accelerate your engineering career.
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-text-secondary mb-8 max-w-xl leading-relaxed">
              Production-grade masterclasses taught by principal engineers and architects. Master distributed systems, NestJS backend architecture, Rust, AI infra, and advanced cloud design.
            </p>

            {/* Action Cluster */}
            <div className="flex flex-wrap items-center gap-3 mb-10 w-full sm:w-auto">
              <a
                href="#catalog"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-primary-container text-white text-xs font-semibold tracking-wide hover:brightness-110 active:scale-[0.98] transition-all shadow-lg group"
              >
                <span>Explore Masterclasses</span>
                <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </a>
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-surface-interactive text-text-primary text-xs font-semibold hover:bg-surface-elevated transition-colors border border-border-control"
              >
                <span className="material-symbols-outlined text-sm text-primary-container">schema</span>
                <span>View Learning Paths</span>
              </Link>
            </div>

            {/* Credibility Matrix */}
            <div className="pt-2 w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex flex-col bg-surface-card p-3.5 rounded-xl border border-border-standard">
                  <span className="text-xl sm:text-2xl font-bold text-text-contrast font-mono">14,200+</span>
                  <span className="text-[11px] text-text-muted mt-0.5">Active Engineers</span>
                </div>
                <div className="flex flex-col bg-surface-card p-3.5 rounded-xl border border-border-standard">
                  <span className="text-xl sm:text-2xl font-bold text-text-contrast font-mono">98.4%</span>
                  <span className="text-[11px] text-text-muted mt-0.5">Completion Sat.</span>
                </div>
                <div className="flex flex-col bg-surface-card p-3.5 rounded-xl border border-border-standard">
                  <span className="text-xl sm:text-2xl font-bold text-text-contrast font-mono">45+</span>
                  <span className="text-[11px] text-text-muted mt-0.5">Deep Tech Tracks</span>
                </div>
                <div className="flex flex-col bg-surface-card p-3.5 rounded-xl border border-border-standard">
                  <span className="text-xl sm:text-2xl font-bold text-primary-bright font-mono">$148k</span>
                  <span className="text-[11px] text-text-muted mt-0.5">Avg Grad Salary</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Glass Code & Stream Studio Mockup */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative rounded-2xl bg-surface-secondary border border-border-standard shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Window Header */}
              <div className="px-4 py-3 bg-surface-container-lowest flex items-center justify-between border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-status-danger/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-status-warning/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-status-success/80 inline-block"></span>
                  <span className="ml-2 text-[11px] text-text-muted font-mono">cluster.controller.ts — NestJS Microservice</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container/20 text-primary uppercase font-mono">
                  Live Stream
                </span>
              </div>

              {/* Video Stream Simulation Preview */}
              <div className="relative w-full aspect-video bg-surface-container-lowest overflow-hidden">
                <img
                  className="w-full h-full object-cover opacity-85"
                  alt="Code telemetry demo"
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-secondary via-transparent to-transparent"></div>

                {/* Telemetry Overlay Bar */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md border border-border-subtle">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-status-success animate-ping"></span>
                    <span className="text-[11px] text-text-primary font-mono">Kafka Event Broker: 42,400 msg/sec</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-status-success">
                    <span className="material-symbols-outlined text-sm">speed</span>
                    <span>1.8ms p99</span>
                  </div>
                </div>
              </div>

              {/* Terminal Code Block */}
              <div className="p-4 bg-surface-card font-mono text-xs text-text-secondary leading-relaxed overflow-x-auto border-t border-border-subtle">
                <div className="flex items-center justify-between text-text-muted mb-2 text-[11px] pb-1.5 border-b border-border-subtle">
                  <span>ACTIVE ARCHITECTURAL MODULE</span>
                  <span className="text-primary font-semibold">PARTITION #03</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <p><span className="text-primary">@Controller</span>(<span className="text-status-success">'telemetry'</span>)</p>
                  <p><span className="text-text-muted">export class</span> TelemetryController &#123;</p>
                  <p className="pl-4"><span className="text-primary">@MessagePattern</span>(<span className="text-status-success">'events.process'</span>)</p>
                  <p className="pl-4"><span className="text-text-muted">async</span> handleClusterBurst(<span className="text-status-warning">payload</span>: EventBatch) &#123;</p>
                  <p className="pl-8 text-status-success">// Guaranteed atomic idempotency with Redis outbox</p>
                  <p className="pl-8"><span className="text-text-muted">await</span> this.outbox.commitBatch(payload);</p>
                  <p className="pl-4">&#125;</p>
                  <p>&#125;</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES STRIP */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 border-y border-border-subtle bg-surface-secondary/40">
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-text-muted font-mono uppercase tracking-wider whitespace-nowrap mr-2">
            Tracks:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-card hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-standard text-xs whitespace-nowrap transition-colors"
            >
              <span className="material-symbols-outlined text-sm text-primary">{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="text-[10px] text-text-muted font-mono">({cat.courseCount})</span>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED MASTERCLASSES CATALOG */}
      <section id="catalog" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-1">
              <span className="material-symbols-outlined text-sm">stars</span>
              <span>Core Curriculum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight">
              Featured Engineering Masterclasses
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Direct access to production system blueprints, labs, and interactive code sandboxes.
            </p>
          </div>

          <Link
            to="/search"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-bright transition-colors"
          >
            <span>View All Courses</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* FEATURED SPOTLIGHT BANNER */}
      {featuredCourse && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="relative rounded-2xl bg-gradient-to-r from-surface-card via-surface-secondary to-accent-ambient-dark border border-border-standard p-6 sm:p-10 overflow-hidden shadow-2xl">
            <div className="max-w-2xl relative z-10 space-y-4">
              <span className="px-2.5 py-1 rounded bg-primary-container text-white text-[11px] font-mono font-bold">
                EDITOR'S CHOICE MASTERCLASS
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-text-contrast">
                {featuredCourse.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {featuredCourse.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to={`/courses/${featuredCourse.id}`}
                  className="px-5 py-2.5 rounded-lg bg-primary-container hover:brightness-110 text-white text-xs font-semibold transition-all shadow-md flex items-center gap-2"
                >
                  <span>Explore Syllabus</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
                <button
                  onClick={() => {
                    setItem({ course: featuredCourse, price: featuredCourse.price });
                    navigate('/checkout');
                  }}
                  className="px-5 py-2.5 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-primary text-xs font-semibold border border-border-control transition-colors"
                >
                  Enroll Now (${featuredCourse.price.toFixed(2)})
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* INSTRUCTOR INVITATION CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-surface-card border border-border-standard rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-elevated text-primary text-[11px] font-mono border border-border-control">
              <span className="material-symbols-outlined text-xs">co_present</span>
              <span>Obsidian Faculty</span>
            </div>
            <h3 className="text-2xl font-bold text-text-contrast">
              Are you a Principal Architect or Systems Engineer?
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Teach on Obsidian. Share production battle stories, build comprehensive curriculums with video and lab PDFs, and earn sovereign royalties.
            </p>
          </div>

          <Link
            to="/instructor/dashboard"
            className="px-6 py-3 rounded-lg bg-primary-container text-white text-xs font-semibold hover:brightness-110 transition-all shadow-lg whitespace-nowrap flex items-center gap-2"
          >
            <span>Access Instructor Studio</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
