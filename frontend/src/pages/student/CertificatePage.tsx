import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourseStore, useAuthStore } from '../../store';

export const CertificatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const getCourseById = useCourseStore((state) => state.getCourseById);
  const user = useAuthStore((state) => state.user);

  const course = getCourseById(id || 'course-1') || useCourseStore((state) => state.courses[0]);

  const [copied, setCopied] = useState(false);
  const credentialId = `OBS-${id ? id.toUpperCase() : 'CRS1'}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-standard">
        <div>
          <div className="flex items-center gap-2 text-status-success font-mono text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
            <span>VERIFIED CREDENTIAL RECORD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
            Certificate of Architectural Competence
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-primary text-xs font-semibold border border-border-control transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">
              {copied ? 'check' : 'share'}
            </span>
            <span>{copied ? 'Link Copied!' : 'Share Credential'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 text-white text-xs font-semibold transition-all shadow-md flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable High-Craft Certificate Frame */}
      <div className="relative bg-surface-card border-2 border-border-standard rounded-3xl p-8 sm:p-14 shadow-2xl overflow-hidden text-center space-y-8">
        {/* Subtle Decorative Ambient Corners */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary-container/10 rounded-br-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-container/10 rounded-tl-full blur-2xl pointer-events-none"></div>

        {/* Certificate Seal & Header */}
        <div className="space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-surface-secondary border border-border-standard flex items-center justify-center text-primary mx-auto shadow-md">
            <span className="material-symbols-outlined text-3xl">token</span>
          </div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
            OBSIDIAN INSTITUTE OF DISTRIBUTED COMPUTING
          </div>
          <h2 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-primary font-bold">
            CERTIFICATE OF COMPLETION & MASTERY
          </h2>
        </div>

        {/* Presentation Statement */}
        <div className="space-y-2 max-w-2xl mx-auto">
          <p className="text-xs text-text-muted">This officially certifies that</p>
          <div className="text-3xl sm:text-4xl font-extrabold text-text-contrast tracking-tight font-display">
            {user?.name || 'Verified Engineer'}
          </div>
          <p className="text-xs text-text-secondary pt-2">
            has rigorously fulfilled all curriculum requirements, laboratory evaluations, and telemetry validation for:
          </p>
          <div className="text-xl sm:text-2xl font-bold text-primary-bright font-title">
            {course.title}
          </div>
        </div>

        {/* Credential Attributes */}
        <div className="max-w-xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-border-subtle text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-text-muted uppercase">Issue Date</span>
            <div className="text-text-primary font-mono">{new Date().toLocaleDateString()}</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-text-muted uppercase">Credential ID</span>
            <div className="text-text-primary font-mono">{credentialId}</div>
          </div>
          <div className="space-y-0.5 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-text-muted uppercase">Verification Protocol</span>
            <div className="text-status-success font-mono">Ed25519 Signed</div>
          </div>
        </div>

        {/* Signatures & QR Code */}
        <div className="max-w-2xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border-subtle">
          {/* Instructor Signature */}
          <div className="text-left space-y-1">
            <div className="font-serif italic text-lg text-text-contrast">Dr. Marcus Vance</div>
            <div className="text-[11px] text-text-muted">Lead Instructor & Principal Architect</div>
          </div>

          {/* QR Verification Live Link */}
          <Link
            to={`/verify-certificate/${credentialId}`}
            className="flex items-center gap-3 bg-surface-secondary hover:bg-surface-interactive px-3.5 py-2.5 rounded-xl border border-border-control transition-all group shadow-sm"
            title="Inspect Cryptographic Verification Record"
          >
            <div className="w-10 h-10 bg-white p-1 rounded flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-black text-2xl">qr_code_2</span>
            </div>
            <div className="text-left text-[10px] font-mono text-text-muted">
              <div className="font-bold text-primary group-hover:underline">VERIFY CREDENTIAL ↗</div>
              <div className="text-text-secondary">{credentialId}</div>
            </div>
          </Link>

          {/* Academic Director Signature */}
          <div className="text-right space-y-1">
            <div className="font-serif italic text-lg text-text-contrast">Elena Rostova</div>
            <div className="text-[11px] text-text-muted">Dean of Systems Curriculum</div>
          </div>
        </div>
      </div>
    </div>
  );
};
