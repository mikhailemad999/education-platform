import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Course, Category } from '../types';
import { MOCK_COURSES, MOCK_CATEGORIES } from '../services/mockData';

export interface CourseState {
  courses: Course[];
  categories: Category[];
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
}

export type CourseStore = CourseState & CourseActions;

export const useCourseStore = create<CourseStore>()(
  subscribeWithSelector((set, get) => ({
    courses: MOCK_COURSES,
    categories: MOCK_CATEGORIES,
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
    getCourseById: (id) => get().courses.find((c) => c.id === id)
  }))
);
