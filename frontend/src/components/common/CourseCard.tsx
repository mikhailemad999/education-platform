import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Course } from '../../types';
import { useCartStore } from '../../store';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();
  const setItem = useCartStore((state) => state.setItem);

  const handleEnrollNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setItem({ course, price: course.price });
    navigate('/checkout');
  };

  return (
    <div className="group flex flex-col bg-surface-card border border-border-standard hover:border-border-control rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      {/* Thumbnail with Badge */}
      <Link to={`/courses/${course.id}`} className="relative aspect-video w-full overflow-hidden bg-surface-secondary">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent opacity-60"></div>
        {course.badge && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider bg-primary-container text-white shadow-sm">
            {course.badge}
          </span>
        )}
        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono bg-surface-container-lowest/80 text-text-primary backdrop-blur-sm">
          {course.duration}
        </span>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & Level */}
          <div className="flex items-center justify-between text-[11px] text-text-muted mb-1.5">
            <span className="text-primary font-medium">{course.categoryName}</span>
            <span>{course.level}</span>
          </div>

          {/* Title */}
          <Link to={`/courses/${course.id}`}>
            <h3 className="font-semibold text-text-contrast text-sm leading-snug line-clamp-2 group-hover:text-primary-bright transition-colors">
              {course.title}
            </h3>
          </Link>

          {/* Instructor */}
          <p className="text-xs text-text-muted mt-1.5 line-clamp-1">
            By <span className="text-text-secondary">{course.instructorName}</span>
          </p>

          {/* Rating & Enrollment */}
          <div className="flex items-center gap-2 mt-2 text-xs">
            <div className="flex items-center text-status-warning font-semibold gap-0.5">
              <span>{course.rating.toFixed(2)}</span>
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            </div>
            <span className="text-text-muted text-[11px]">({course.reviewCount.toLocaleString()})</span>
            <span className="text-text-muted text-[11px] ml-auto">
              {course.enrolledStudents.toLocaleString()} students
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-text-contrast font-mono">
              ${course.price.toFixed(2)}
            </span>
            {course.originalPrice > course.price && (
              <span className="text-xs text-text-muted line-through font-mono">
                ${course.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to={`/courses/${course.id}`}
              className="px-2.5 py-1.5 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-secondary hover:text-text-primary text-xs transition-colors"
            >
              Details
            </Link>
            <button
              onClick={handleEnrollNow}
              className="px-3 py-1.5 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1"
            >
              <span>Enroll</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
