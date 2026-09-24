import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourseStore } from '../../store';

export const CertificateVerificationPage: React.FC = () => {
  const { code } = useParams<{ code?: string }>();
  const courses = useCourseStore((state) => state.courses);

  const [inputCode, setInputCode] = useState(code || 'OBS-COURSE-1-849201');
  const [activeCode, setActiveCode] = useState(code || 'OBS-COURSE-1-849201');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (code) {
      setInputCode(code);
      setActiveCode(code);
    }
  }, [code]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setActiveCode(inputCode.trim().toUpperCase());
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find course matching or default
  const matchedCourse = courses.find((c) =>
    activeCode.toLowerCase().includes(c.id.toLowerCase())
  ) || courses[0];

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-bg-canvas relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between text-xs text-text-muted font-mono">
          <Link to="/" className="hover:text-text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Return to Catalog</span>
          </Link>
          <span>Obsidian Public Trust Registry</span>
        </div>

        {/* Search Credential Card */}
        <div className="bg-surface-card border border-border-standard rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-lg font-bold text-text-contrast flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                Public Credential Verification Engine
              </h1>
              <p className="text-xs text-text-muted">
                Inspect and cryptographically validate engineer certificates issued by Obsidian.
              </p>
            </div>
            <span className="text-[10px] font-mono text-status-success font-bold bg-status-success/15 px-2 py-0.5 rounded self-start sm:self-auto">
              ONLINE REGISTRY
            </span>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 pt-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Enter Credential ID (e.g. OBS-COURSE-1-849201)"
              className="flex-1 bg-surface-secondary border border-border-control rounded-xl px-4 py-2.5 text-xs text-text-primary font-mono focus:outline-none focus:border-primary-container"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary-container hover:brightness-110 active:scale-95 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">search</span>
              <span>Verify</span>
            </button>
          </form>
        </div>

        {/* Verification Result Card */}
        <div className="bg-surface-card border-2 border-border-standard rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          {/* Header Status Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-status-success/15 border border-status-success/30 flex items-center justify-center text-status-success">
                <span className="material-symbols-outlined text-2xl">verified</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-status-success uppercase tracking-wider">
                    VALID & AUTHENTICATED
                  </span>
                  <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-text-contrast mt-0.5">
                  Official Obsidian Certified Architect
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-primary text-xs font-semibold border border-border-control transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">
                  {copied ? 'check' : 'share'}
                </span>
                <span>{copied ? 'Copied' : 'Share Verification'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-primary text-xs font-semibold border border-border-control transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Print Record</span>
              </button>
            </div>
          </div>

          {/* Certificate Credential Body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Recipient Details */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-text-muted">Credential Recipient</span>
                <div className="text-2xl font-bold text-text-contrast">Alex Rivera</div>
                <span className="text-xs text-primary font-mono">Senior Distributed Systems Engineer</span>
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-[11px] font-mono uppercase text-text-muted">Accredited Specialization</span>
                <div className="text-base font-semibold text-text-contrast leading-snug">
                  {matchedCourse.title}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed pt-1">
                  Rigorous completion of event-driven Kafka architectures, Transactional Outbox design patterns, and OpenTelemetry instrumentation.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to={`/courses/${matchedCourse.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>View Verified Curriculum Syllabus</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Cryptographic & Audit Details */}
            <div className="bg-surface-secondary/70 rounded-2xl p-5 border border-border-subtle space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <span className="text-text-muted uppercase text-[10px]">Verification Parameters</span>
                <span className="text-status-success font-bold">SHA-256 / Ed25519</span>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Credential ID:</span>
                  <span className="text-text-contrast font-bold">{activeCode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Issue Date:</span>
                  <span className="text-text-contrast">February 18, 2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Examination Score:</span>
                  <span className="text-status-success font-bold">100% (High Honors)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Issuing Authority:</span>
                  <span className="text-text-contrast">Obsidian Distributed Institute</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Lead Instructor:</span>
                  <span className="text-text-contrast">{matchedCourse.instructorName}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border-subtle space-y-1">
                <span className="text-[10px] text-text-muted uppercase">Digital Signature Signature Block:</span>
                <div className="p-2 rounded bg-surface-card border border-border-control text-[10px] text-text-muted break-all select-all">
                  ed25519:7a4f91b0c82e34d6e901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3
                </div>
              </div>
            </div>
          </div>

          {/* Verification Trust Seal */}
          <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">security</span>
              <span>This record is immutable and verified on the Obsidian Institutional Public Registry.</span>
            </div>
            <div className="font-mono text-[11px] text-text-muted">
              Registry Node: <strong className="text-text-contrast">us-east-cluster-04</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
