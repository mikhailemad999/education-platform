import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-border-standard mt-20 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-xs text-text-secondary">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        <div className="col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-surface-card border border-border-standard flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-lg">token</span>
            </div>
            <span className="font-title-sm tracking-tight text-text-contrast uppercase font-bold text-sm">
              Obsidian<span className="text-primary-container">.edu</span>
            </span>
          </Link>
          <p className="max-w-sm text-text-muted text-xs leading-relaxed">
            The sovereign engineering education platform. Deep dive into production microservices, kernel telemetry, distributed caching, and zero-trust cloud architectures.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted">
            <span className="w-2 h-2 rounded-full bg-status-success"></span>
            Global Edge: 28 regions operational
          </div>
        </div>

        <div>
          <h4 className="text-text-contrast font-semibold uppercase tracking-wider text-[11px] mb-3">
            Masterclasses
          </h4>
          <ul className="space-y-2">
            <li><Link to="/courses/course-1" className="hover:text-text-contrast transition-colors">Distributed Systems (NestJS)</Link></li>
            <li><Link to="/courses/course-2" className="hover:text-text-contrast transition-colors">Linux Kernel & eBPF</Link></li>
            <li><Link to="/courses/course-3" className="hover:text-text-contrast transition-colors">Rust Systems with Tokio</Link></li>
            <li><Link to="/courses/course-4" className="hover:text-text-contrast transition-colors">Kubernetes Mesh & GitOps</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-text-contrast font-semibold uppercase tracking-wider text-[11px] mb-3">
            Learner Resources
          </h4>
          <ul className="space-y-2">
            <li><Link to="/search" className="hover:text-text-contrast transition-colors">Explore All Syllabuses</Link></li>
            <li><Link to="/pricing" className="hover:text-text-contrast transition-colors">SaaS Subscriptions</Link></li>
            <li><Link to="/auth/login" className="hover:text-text-contrast transition-colors">Student Sign In</Link></li>
            <li><Link to="/auth/register" className="hover:text-text-contrast transition-colors">Register as Learner</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-text-contrast font-semibold uppercase tracking-wider text-[11px] mb-3">
            Internal Operations
          </h4>
          <ul className="space-y-2">
            <li>
              <Link to="/portal/login" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>Staff & Faculty Gateway</span>
              </Link>
            </li>
            <li><span className="text-text-muted">Faculty Verification</span></li>
            <li><span className="text-text-muted">Curriculum Compliance</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-text-muted">
        <div>
          © {new Date().getFullYear()} Obsidian Education Inc. Sovereign Architecture. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link to="/portal/login" className="hover:text-primary transition-colors">
            Operations Portal Login
          </Link>
          <span className="hover:text-text-primary transition-colors cursor-pointer">Security Ledger</span>
          <span className="hover:text-text-primary transition-colors cursor-pointer">Status: 99.99%</span>
        </div>
      </div>
    </footer>
  );
};
