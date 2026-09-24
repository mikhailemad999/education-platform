import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Course, Category, Review, CourseQuestion, CourseAnswer } from '../types';
import { MOCK_COURSES, MOCK_CATEGORIES, MOCK_REVIEWS, MOCK_QUESTIONS } from '../services/mockData';

export interface CourseState {
  courses: Course[];
  categories: Category[];
  reviews: Review[];
  questions: CourseQuestion[];
  searchQuery: string;
  selectedCategoryId: string | null;
  selectedLevel: string | null;
  selectedPriceRange: string | null;
  sortBy: 'popular' | 'newest' | 'rating' | 'price-asc' | 'price-desc';
}

export interface CourseActions {
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedLevel: (level: string | null) => void;
  setSelectedPriceRange: (range: string | null) => void;
  setSortBy: (sortBy: CourseState['sortBy']) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  getCourseById: (id: string) => Course | undefined;

  // Category Management
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Reviews
  addReview: (review: Review) => void;
  upvoteReview: (id: string) => void;

  // Q&A
  addQuestion: (question: CourseQuestion) => void;
  upvoteQuestion: (id: string) => void;
  addAnswer: (questionId: string, answer: CourseAnswer) => void;
  markQuestionResolved: (questionId: string) => void;
  deleteQuestion: (questionId: string) => void;
}

export type CourseStore = CourseState & CourseActions;

export const useCourseStore = create<CourseStore>()(
  subscribeWithSelector((set, get) => ({
    courses: MOCK_COURSES,
    categories: MOCK_CATEGORIES,
    reviews: MOCK_REVIEWS,
    questions: MOCK_QUESTIONS,
    searchQuery: '',
    selectedCategoryId: null,
    selectedLevel: null,
    selectedPriceRange: null,
    sortBy: 'popular',

    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setSelectedCategory: (selectedCategoryId) => set({ selectedCategoryId }),
    setSelectedLevel: (selectedLevel) => set({ selectedLevel }),
    setSelectedPriceRange: (selectedPriceRange) => set({ selectedPriceRange }),
    setSortBy: (sortBy) => set({ sortBy }),

    addCourse: (course) => set((state) => ({ courses: [course, ...state.courses] })),
    updateCourse: (id, updates) =>
      set((state) => ({
        courses: state.courses.map((c) => (c.id === id ? { ...c, ...updates } : c))
      })),
    deleteCourse: (id) =>
      set((state) => ({
        courses: state.courses.filter((c) => c.id !== id)
      })),
    getCourseById: (id) => get().courses.find((c) => c.id === id),

    // Category Management
    addCategory: (category) =>
      set((state) => ({ categories: [...state.categories, category] })),
    updateCategory: (id, updates) =>
      set((state) => ({
        categories: state.categories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
      })),
    deleteCategory: (id) =>
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id)
      })),

    // Reviews & Rating recalculation
    addReview: (review) =>
      set((state) => {
        const updatedReviews = [review, ...state.reviews];
        // Recalculate course rating
        const courseReviews = updatedReviews.filter((r) => r.courseId === review.courseId);
        const avgRating =
          courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;
        const updatedCourses = state.courses.map((c) => {
          if (c.id === review.courseId) {
            return {
              ...c,
              rating: Number(avgRating.toFixed(2)),
              reviewCount: c.reviewCount + 1
            };
          }
          return c;
        });

        return {
          reviews: updatedReviews,
          courses: updatedCourses
        };
      }),

    upvoteReview: (id) =>
      set((state) => ({
        reviews: state.reviews.map((r) =>
          r.id === id ? { ...r, helpfulVotes: (r.helpfulVotes || 0) + 1 } : r
        )
      })),

    // Q&A
    addQuestion: (question) =>
      set((state) => ({
        questions: [question, ...state.questions]
      })),

    upvoteQuestion: (id) =>
      set((state) => ({
        questions: state.questions.map((q) =>
          q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q
        )
      })),

    addAnswer: (questionId, answer) =>
      set((state) => ({
        questions: state.questions.map((q) => {
          if (q.id === questionId) {
            return {
              ...q,
              hasInstructorReplied: q.hasInstructorReplied || answer.isInstructorAnswer,
              answers: [...q.answers, answer]
            };
          }
          return q;
        })
      })),

    markQuestionResolved: (questionId) =>
      set((state) => ({
        questions: state.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                status: q.status === 'resolved' ? 'unresolved' : 'resolved'
              }
            : q
        )
      })),

    deleteQuestion: (questionId) =>
      set((state) => ({
        questions: state.questions.filter((q) => q.id !== questionId)
      }))
  }))
);

