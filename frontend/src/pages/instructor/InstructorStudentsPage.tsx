import React, { useState } from 'react';
import { useCourseStore } from '../../store';
import { MOCK_STUDENT_ENROLLMENTS } from '../../services/mockData';
import { StudentEnrollmentDetail } from '../../types';
import { Modal } from '../../components/common/Modal';

export const InstructorStudentsPage: React.FC = () => {
  const courses = useCourseStore((state) => state.courses);
  const instructorCourses = courses.filter((c) => c.instructorId === 'user-instructor-1');

  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'at_risk'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<StudentEnrollmentDetail[]>(MOCK_STUDENT_ENROLLMENTS);

  // Message Modal
  const [messagingStudent, setMessagingStudent] = useState<StudentEnrollmentDetail | null>(null);
  const [isBroadcastModal, setIsBroadcastModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim()) return;

    if (isBroadcastModal) {
      setActionNotice(`Broadcast announcement dispatched to all ${students.length} enrolled engineers.`);
    } else if (messagingStudent) {
      setActionNotice(`Direct academic message sent to ${messagingStudent.studentName} (${messagingStudent.studentEmail}).`);
    }

    setMessagingStudent(null);
    setIsBroadcastModal(false);
    setMessageSubject('');
    setMessageBody('');
    setTimeout(() => setActionNotice(''), 4000);
  };

  const filteredStudents = students.filter((s) => {
    const matchesCourse = selectedCourseId === 'all' || s.courseId === selectedCourseId;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      s.studentName.toLowerCase().includes(query) ||
      s.studentEmail.toLowerCase().includes(query) ||
      s.companyOrOrg.toLowerCase().includes(query) ||
      s.country.toLowerCase().includes(query);

    return matchesCourse && matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border-standard">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
              Faculty Demographics & Telemetry
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-status-success/15 text-status-success text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse"></span>
              LIVE COHORT DATA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
            Student Demographics & Engagement Intelligence
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Analyze global student cohorts, track lecture consumption drop-offs, inspect quiz performance, and mentor active engineers.
          </p>
        </div>

        {/* Global Action / Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="bg-surface-card border border-border-control rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary-container"
          >
            <option value="all">All My Masterclasses (12,850 Students)</option>
            {instructorCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setMessageSubject('Important Architectural Lab Update & Live Office Hours');
              setMessageBody('Hello engineering cohort,\n\nWe have updated the Docker compose configuration for the Kafka partition lab. Please pull the latest repo branch.');
              setIsBroadcastModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">campaign</span>
            <span>Broadcast to Cohort</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-status-success/10 border border-status-success/30 text-status-success text-xs flex items-center gap-2 animate-fade-in font-medium">
          <span className="material-symbols-outlined text-base">verified</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Top Telemetry KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Total Enrolled Learners</span>
          <div className="text-2xl font-bold font-mono text-text-contrast">12,850</div>
          <span className="text-[11px] text-status-success font-mono">+420 this month</span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Active Daily Learners</span>
          <div className="text-2xl font-bold font-mono text-primary">1,420</div>
          <span className="text-[11px] text-text-muted font-mono">Consuming video/lab content</span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Cohort Completion Rate</span>
          <div className="text-2xl font-bold font-mono text-status-success">78.4%</div>
          <span className="text-[11px] text-text-muted font-mono">22% higher than industry avg</span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Accredited Certifications</span>
          <div className="text-2xl font-bold font-mono text-status-warning">8,920</div>
          <span className="text-[11px] text-text-muted font-mono">Verifiable Ed25519 issued</span>
        </div>
      </div>

      {/* Demographics & Engagement Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Geographic Distribution (6 cols) */}
        <div className="lg:col-span-6 bg-surface-card border border-border-standard rounded-2xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div>
              <h2 className="text-sm font-bold text-text-contrast flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">public</span>
                Geographical Learner Distribution
              </h2>
              <p className="text-[11px] text-text-muted">
                Engineers enrolled across 48+ countries worldwide
              </p>
            </div>
            <span className="text-[10px] font-mono text-text-muted uppercase">Global WAN</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {[
              { country: 'United States', flag: '🇺🇸', percent: 42, count: 5397 },
              { country: 'Germany', flag: '🇩🇪', percent: 18, count: 2313 },
              { country: 'United Kingdom', flag: '🇬🇧', percent: 14, count: 1799 },
              { country: 'India', flag: '🇮🇳', percent: 12, count: 1542 },
              { country: 'Japan', flag: '🇯🇵', percent: 8, count: 1028 },
              { country: 'France & Others', flag: '🌍', percent: 6, count: 771 }
            ].map((g) => (
              <div key={g.country} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{g.flag}</span>
                    <span className="font-medium text-text-contrast">{g.country}</span>
                  </div>
                  <div className="font-mono text-text-muted flex items-center gap-2">
                    <span>{g.count.toLocaleString()} engineers</span>
                    <span className="font-bold text-text-contrast">{g.percent}%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-container rounded-full"
                    style={{ width: `${g.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engineering Seniority & Organizations (6 cols) */}
        <div className="lg:col-span-6 bg-surface-card border border-border-standard rounded-2xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div>
              <h2 className="text-sm font-bold text-text-contrast flex items-center gap-2">
                <span className="material-symbols-outlined text-status-success text-base">badge</span>
                Learner Seniority & Enterprise Demographics
              </h2>
              <p className="text-[11px] text-text-muted">
                Background levels of currently active student engineers
              </p>
            </div>
            <span className="text-[10px] font-mono text-status-success font-bold">88% SENIOR+</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-surface-secondary/70 border border-border-subtle space-y-1">
              <span className="text-[10px] font-mono uppercase text-text-muted">Staff & Principal</span>
              <div className="text-xl font-bold font-mono text-text-contrast">38%</div>
              <p className="text-[10px] text-text-secondary">Designing enterprise distributed backends</p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-secondary/70 border border-border-subtle space-y-1">
              <span className="text-[10px] font-mono uppercase text-text-muted">Senior Backend</span>
              <div className="text-xl font-bold font-mono text-text-contrast">34%</div>
              <p className="text-[10px] text-text-secondary">Leveling up Kafka & microservices patterns</p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-secondary/70 border border-border-subtle space-y-1">
              <span className="text-[10px] font-mono uppercase text-text-muted">Tech Leads</span>
              <div className="text-xl font-bold font-mono text-text-contrast">18%</div>
              <p className="text-[10px] text-text-secondary">Overseeing modular NestJS architectures</p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-secondary/70 border border-border-subtle space-y-1">
              <span className="text-[10px] font-mono uppercase text-text-muted">DevOps & SRE</span>
              <div className="text-xl font-bold font-mono text-text-contrast">10%</div>
              <p className="text-[10px] text-text-secondary">OpenTelemetry, Redis clustering & k8s</p>
            </div>
          </div>

          {/* Top Companies */}
          <div className="pt-2 border-t border-border-subtle space-y-2">
            <span className="text-[10px] font-mono uppercase text-text-muted tracking-wider">
              Top Represented Engineering Organizations:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['Google', 'Stripe', 'Netflix', 'AWS', 'Snowflake', 'Datadog', 'Apex FinTech', 'Starlight Cloud'].map((corp) => (
                <span
                  key={corp}
                  className="px-2.5 py-1 rounded-md bg-surface-interactive border border-border-control text-[11px] font-mono text-text-secondary"
                >
                  {corp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Course Consumption & Retention Funnel */}
      <div className="bg-surface-card border border-border-standard rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
          <div>
            <h2 className="text-base font-bold text-text-contrast flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">filter_alt</span>
              Curriculum Consumption & Retention Funnel
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Visual drop-off rates across each critical milestone from enrollment to certification
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <span>Avg Study: <strong className="text-text-contrast">4.8 hrs/wk</strong></span>
            <span>•</span>
            <span>Avg Quiz Score: <strong className="text-status-success font-bold">91.4%</strong></span>
          </div>
        </div>

        {/* Funnel Steps */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { step: '1. Enrolled', count: '12,850', percent: '100%', color: 'border-primary/40 text-primary' },
            { step: '2. Started Lec 01', count: '12,104', percent: '94.2%', color: 'border-primary/40 text-primary' },
            { step: '3. Mid-Point Lab', count: '10,485', percent: '81.6%', color: 'border-status-success/40 text-status-success' },
            { step: '4. Practice Quiz', count: '9,380', percent: '73.0%', color: 'border-status-success/40 text-status-success' },
            { step: '5. Completed', count: '8,802', percent: '68.5%', color: 'border-status-warning/40 text-status-warning' },
            { step: '6. Certificate', count: '7,980', percent: '62.1%', color: 'border-status-warning/40 text-status-warning' },
          ].map((f, i) => (
            <div
              key={f.step}
              className={`p-3.5 rounded-xl bg-surface-secondary border ${f.color} space-y-1 relative`}
            >
              <span className="text-[10px] font-mono uppercase text-text-muted">{f.step}</span>
              <div className="text-base font-bold font-mono text-text-contrast">{f.count}</div>
              <div className="text-xs font-bold font-mono">{f.percent}</div>
              {i < 5 && (
                <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-text-muted">
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Enrolled Students Directory Table */}
      <div className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
          <div>
            <h2 className="text-base font-bold text-text-contrast flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">groups</span>
              Active Student Roster & Academic Records
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Inspect individual learner progress, exam scores, and provide personalized mentorship
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            {(['all', 'active', 'completed', 'at_risk'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-primary-container text-white shadow-sm font-semibold'
                    : 'bg-surface-secondary text-text-muted hover:text-text-contrast'
                }`}
              >
                {st === 'at_risk' ? 'At Risk' : st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="w-full sm:w-80 relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-base">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, email, org, or country..."
            className="w-full bg-surface-secondary border border-border-control rounded-xl pl-9 pr-3.5 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary text-text-muted uppercase text-[10px] font-mono tracking-wider border-b border-border-subtle">
              <tr>
                <th className="py-3 px-4">Student Engineer</th>
                <th className="py-3 px-4">Company & Seniority</th>
                <th className="py-3 px-4">Origin</th>
                <th className="py-3 px-4">Curriculum Progress</th>
                <th className="py-3 px-4">Quiz Score</th>
                <th className="py-3 px-4">Certificate</th>
                <th className="py-3 px-4 text-right">Academic Mentorship</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-surface-interactive/60 transition-colors">
                  {/* Student */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.studentAvatar}
                        alt={s.studentName}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-border-control"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-text-contrast truncate">{s.studentName}</div>
                        <div className="text-[11px] text-text-muted font-mono truncate">{s.studentEmail}</div>
                      </div>
                    </div>
                  </td>

                  {/* Company & Seniority */}
                  <td className="py-3.5 px-4">
                    <div className="text-text-contrast font-medium">{s.companyOrOrg}</div>
                    <span className="text-[10px] font-mono text-primary px-1.5 py-0.5 rounded bg-primary-container/15">
                      {s.seniority}
                    </span>
                  </td>

                  {/* Origin */}
                  <td className="py-3.5 px-4 font-mono text-text-muted">
                    {s.country}
                  </td>

                  {/* Progress */}
                  <td className="py-3.5 px-4 min-w-[150px]">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-mono">
                        <span className="text-text-muted">{s.progressPercentage}%</span>
                        <span className="text-[10px] text-text-muted truncate max-w-[100px]">
                          {s.lastLectureWatched.split('—')[0]}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            s.progressPercentage === 100
                              ? 'bg-status-success'
                              : s.progressPercentage < 30
                              ? 'bg-status-error'
                              : 'bg-primary-container'
                          }`}
                          style={{ width: `${s.progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Quiz Score */}
                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        s.quizScore >= 90
                          ? 'bg-status-success/15 text-status-success'
                          : s.quizScore >= 60
                          ? 'bg-status-warning/15 text-status-warning'
                          : 'bg-status-error/15 text-status-error'
                      }`}
                    >
                      {s.quizScore}%
                    </span>
                  </td>

                  {/* Certificate */}
                  <td className="py-3.5 px-4">
                    {s.certificateIssued ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-status-success font-mono">
                        <span className="material-symbols-outlined text-sm">verified</span>
                        <span>Issued</span>
                      </span>
                    ) : (
                      <span className="text-text-muted text-[11px] font-mono">In Progress</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setMessageSubject(`Academic Feedback — ${s.courseTitle.slice(0, 30)}...`);
                        setMessageBody(`Hello ${s.studentName},\n\nI reviewed your progress on ${s.lastLectureWatched}. Let me know if you would like dedicated architectural feedback on your lab implementation.`);
                        setMessagingStudent(s);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-primary text-xs font-semibold border border-border-control transition-colors flex items-center gap-1.5 ml-auto"
                    >
                      <span className="material-symbols-outlined text-sm">mail</span>
                      <span>Send Note</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Direct Academic Message */}
      <Modal
        isOpen={!!messagingStudent || isBroadcastModal}
        onClose={() => {
          setMessagingStudent(null);
          setIsBroadcastModal(false);
        }}
        title={
          isBroadcastModal
            ? 'Broadcast Cohort Announcement'
            : `Send Academic Note to ${messagingStudent?.studentName}`
        }
      >
        <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-text-secondary font-medium">Subject</label>
            <input
              type="text"
              required
              value={messageSubject}
              onChange={(e) => setMessageSubject(e.target.value)}
              className="w-full bg-surface-card border border-border-control rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary-container"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-text-secondary font-medium">Message Body</label>
            <textarea
              rows={5}
              required
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              placeholder="Write your mentorship feedback, clarification, or cohort advisory note..."
              className="w-full bg-surface-card border border-border-control rounded-lg p-3 text-text-primary font-mono focus:outline-none focus:border-primary-container"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => {
                setMessagingStudent(null);
                setIsBroadcastModal(false);
              }}
              className="px-4 py-2 rounded-lg bg-surface-secondary text-text-muted hover:text-text-contrast"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary-container hover:brightness-110 text-white font-semibold shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              <span>{isBroadcastModal ? 'Send Broadcast' : 'Dispatch Note'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
