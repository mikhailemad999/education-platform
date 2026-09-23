import React, { useState } from 'react';
import { MOCK_REVIEWS } from '../../services/mockData';
import { Review } from '../../types';

export const InstructorReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const handleSendReply = (reviewId: string) => {
    const text = replyTextMap[reviewId];
    if (!text?.trim()) return;

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              instructorReply: {
                text,
                repliedAt: 'Just now'
              }
            }
          : r
      )
    );
    setActiveReplyId(null);
    setReplyTextMap((prev) => ({ ...prev, [reviewId]: '' }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-border-standard">
        <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
          Quality & Feedback
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
          Reviews & Moderation
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Engage directly with student engineers, clarify architectural concepts, and maintain 5-star ratings.
        </p>
      </div>

      {/* Ratings Distribution Matrix */}
      <div className="bg-surface-card border border-border-standard rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
        <div className="text-center md:text-left space-y-1">
          <div className="text-5xl font-extrabold text-text-contrast font-mono">4.95</div>
          <div className="flex items-center justify-center md:justify-start text-status-warning text-lg">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            ))}
          </div>
          <div className="text-xs text-text-muted">Faculty Average (3,420 Ratings)</div>
        </div>

        {/* Breakdown Bars */}
        <div className="flex-1 max-w-md space-y-2 text-xs font-mono">
          {[
            { stars: '5 Stars', pct: 94 },
            { stars: '4 Stars', pct: 5 },
            { stars: '3 Stars', pct: 1 },
            { stars: '2 Stars', pct: 0 },
            { stars: '1 Star', pct: 0 }
          ].map((row) => (
            <div key={row.stars} className="flex items-center gap-3">
              <span className="w-16 text-text-muted text-[11px]">{row.stars}</span>
              <div className="flex-1 h-2 rounded-full bg-surface-secondary overflow-hidden">
                <div
                  className="h-full bg-status-warning rounded-full"
                  style={{ width: `${row.pct}%` }}
                ></div>
              </div>
              <span className="w-8 text-right text-text-secondary text-[11px]">{row.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-4 shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={rev.userAvatar}
                  alt={rev.userName}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-border-standard"
                />
                <div>
                  <h4 className="text-xs font-bold text-text-contrast">{rev.userName}</h4>
                  <div className="flex items-center gap-1.5 text-status-warning text-xs mt-0.5">
                    <div className="flex items-center">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-text-muted">• {rev.createdAt}</span>
                  </div>
                </div>
              </div>

              {rev.sentiment && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-status-success/15 text-status-success">
                  {rev.sentiment}
                </span>
              )}
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              {rev.comment}
            </p>

            {/* Instructor Reply Box */}
            {rev.instructorReply ? (
              <div className="p-4 rounded-xl bg-surface-secondary border border-border-subtle text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-primary font-semibold text-[11px]">
                    <span className="material-symbols-outlined text-xs">reply</span>
                    <span>Your Official Faculty Reply</span>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted">
                    {rev.instructorReply.repliedAt}
                  </span>
                </div>
                <p className="text-text-primary text-[11px] leading-relaxed">
                  {rev.instructorReply.text}
                </p>
              </div>
            ) : activeReplyId === rev.id ? (
              <div className="space-y-3 pt-2">
                <textarea
                  rows={3}
                  value={replyTextMap[rev.id] || ''}
                  onChange={(e) =>
                    setReplyTextMap({ ...replyTextMap, [rev.id]: e.target.value })
                  }
                  placeholder="Draft your response to the student..."
                  className="w-full bg-surface-secondary border border-border-control rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:border-primary-container"
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setActiveReplyId(null)}
                    className="px-3 py-1.5 rounded-lg bg-surface-interactive text-text-secondary text-xs hover:text-text-primary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSendReply(rev.id)}
                    className="px-4 py-1.5 rounded-lg bg-primary-container hover:brightness-110 text-white text-xs font-semibold shadow-sm"
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setActiveReplyId(rev.id)}
                  className="px-3 py-1 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-primary text-xs font-semibold border border-border-control transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">reply</span>
                  <span>Respond to Student</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
