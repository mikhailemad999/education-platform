import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Enrollment } from '../types';
import { MOCK_ENROLLMENTS } from '../services/mockData';

export interface LearningState {
  enrollments: Enrollment[];
  activeCourseId: string | null;
  activeLectureId: string | null;
  userNotes: Record<string, string>; // lectureId -> note
}

export interface LearningActions {
  setActiveLesson: (courseId: string, lectureId: string) => void;
  markLectureComplete: (courseId: string, lectureId: string) => void;
  saveNote: (lectureId: string, note: string) => void;
  enrollInCourse: (courseId: string, userId: string) => void;
  getEnrollmentByCourseId: (courseId: string) => Enrollment | undefined;
}

export type LearningStore = LearningState & LearningActions;

export const useLearningStore = create<LearningStore>()(
  subscribeWithSelector((set, get) => ({
    enrollments: MOCK_ENROLLMENTS,
    activeCourseId: 'course-1',
    activeLectureId: 'lec-1-3',
    userNotes: {
      'lec-1-1': 'Architecture looks solid. Remember to check Kafka offset commit strategy.'
    },

    setActiveLesson: (courseId, lectureId) =>
      set({ activeCourseId: courseId, activeLectureId: lectureId }),

    markLectureComplete: (courseId, lectureId) => {
      set((state) => {
        const existing = state.enrollments.find((e) => e.courseId === courseId);
        if (!existing) return state;

        const alreadyCompleted = existing.completedLectureIds.includes(lectureId);
        const updatedCompleted = alreadyCompleted
          ? existing.completedLectureIds
          : [...existing.completedLectureIds, lectureId];

        // Total lectures in course-1 is 6
        const newProgress = Math.min(100, Math.round((updatedCompleted.length / 6) * 100));

        const updatedEnrollments = state.enrollments.map((e) =>
          e.courseId === courseId
            ? {
                ...e,
                completedLectureIds: updatedCompleted,
                progressPercentage: newProgress,
                status: (newProgress === 100 ? 'completed' : 'active') as 'active' | 'completed',
                lastLectureId: lectureId
              }
            : e
        );

        return { enrollments: updatedEnrollments };
      });
    },

    saveNote: (lectureId, note) =>
      set((state) => ({
        userNotes: { ...state.userNotes, [lectureId]: note }
      })),

    enrollInCourse: (courseId, userId) => {
      set((state) => {
        const exists = state.enrollments.some((e) => e.courseId === courseId);
        if (exists) return state;

        const newEnrollment: Enrollment = {
          id: `enroll-${Date.now()}`,
          userId,
          courseId,
          status: 'active',
          enrolledAt: new Date().toISOString().split('T')[0],
          progressPercentage: 0,
          completedLectureIds: [],
          lastLectureId: 'lec-1-1'
        };

        return { enrollments: [newEnrollment, ...state.enrollments] };
      });
    },

    getEnrollmentByCourseId: (courseId) =>
      get().enrollments.find((e) => e.courseId === courseId)
  }))
);
