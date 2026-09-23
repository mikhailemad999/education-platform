import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCourseStore } from '../../store';
import { CourseCard } from '../../components/common/CourseCard';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const courses = useCourseStore((state) => state.courses);
  const categories = useCourseStore((state) => state.categories);
  const searchQuery = useCourseStore((state) => state.searchQuery);
  const setSearchQuery = useCourseStore((state) => state.setSearchQuery);
  const selectedCategoryId = useCourseStore((state) => state.selectedCategoryId);
  const setSelectedCategory = useCourseStore((state) => state.setSelectedCategory);
  const selectedLevel = useCourseStore((state) => state.selectedLevel);
  const setSelectedLevel = useCourseStore((state) => state.setSelectedLevel);
  const sortBy = useCourseStore((state) => state.sortBy);
  const setSortBy = useCourseStore((state) => state.setSortBy);

  // Sync url param if present
  React.useEffect(() => {
    if (urlQuery && urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
  }, [urlQuery]);

  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          c.title.toLowerCase().includes(query) ||
          c.subtitle.toLowerCase().includes(query) ||
          c.instructorName.toLowerCase().includes(query) ||
          c.categoryName.toLowerCase().includes(query);

        const matchesCat = !selectedCategoryId || c.categoryId === selectedCategoryId;
        const matchesLevel = !selectedLevel || c.level === selectedLevel;

        return matchesQuery && matchesCat && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return b.enrolledStudents - a.enrolledStudents; // 'popular'
      });
  }, [courses, searchQuery, selectedCategoryId, selectedLevel, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedLevel(null);
    setSearchParams({});
  };

  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-standard">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight">
            Curriculum Discovery & Search
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Browse through production syllabuses, architectures, and systems tracks.
          </p>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword or stack..."
              className="w-full bg-surface-card border border-border-control rounded-lg pl-9 pr-8 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-text-muted hover:text-text-primary"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mt-4">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-surface-card border border-border-standard text-xs font-semibold text-text-contrast shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary">tune</span>
            <span>Filters & Categories</span>
            {(selectedCategoryId || selectedLevel) && (
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            )}
          </div>
          <span className="material-symbols-outlined text-sm text-text-muted">
            {mobileFilterOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </div>

      {/* Main Filter & Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8 items-start">
        {/* Sidebar Filters */}
        <aside
          className={`lg:col-span-1 bg-surface-card border border-border-standard rounded-xl p-5 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <span className="text-xs font-mono uppercase tracking-wider text-text-contrast font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary">filter_list</span>
              Filters
            </span>
            {(selectedCategoryId || selectedLevel || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-primary hover:underline font-semibold"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div>
            <h4 className="text-xs font-semibold text-text-contrast mb-3">Categories</h4>
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between text-xs cursor-pointer p-1.5 rounded hover:bg-surface-interactive transition-colors ${
                  !selectedCategoryId ? 'text-primary font-semibold' : 'text-text-secondary'
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                <span>All Categories</span>
                <span className="text-[10px] font-mono text-text-muted">{courses.length}</span>
              </label>

              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex items-center justify-between text-xs cursor-pointer p-1.5 rounded hover:bg-surface-interactive transition-colors ${
                    selectedCategoryId === cat.id ? 'text-primary font-semibold bg-surface-interactive' : 'text-text-secondary'
                  }`}
                  onClick={() => setSelectedCategory(selectedCategoryId === cat.id ? null : cat.id)}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] font-mono text-text-muted">{cat.courseCount}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="pt-4 border-t border-border-subtle">
            <h4 className="text-xs font-semibold text-text-contrast mb-3">Experience Level</h4>
            <div className="space-y-2">
              {['All Levels', 'Intermediate', 'Advanced'].map((lvl) => (
                <label
                  key={lvl}
                  className={`flex items-center gap-2 text-xs cursor-pointer text-text-secondary hover:text-text-primary`}
                  onClick={() => setSelectedLevel(selectedLevel === lvl ? null : lvl)}
                >
                  <input
                    type="checkbox"
                    checked={selectedLevel === lvl}
                    onChange={() => {}}
                    className="rounded bg-surface-secondary border-border-control text-primary-container focus:ring-0"
                  />
                  <span>{lvl}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <section className="lg:col-span-3">
          {/* Controls Bar */}
          <div className="flex items-center justify-between mb-6 pb-2 text-xs text-text-secondary">
            <div>
              Showing <span className="font-semibold text-text-contrast font-mono">{filteredCourses.length}</span> masterclasses
            </div>

            <div className="flex items-center gap-2">
              <span className="text-text-muted text-[11px]">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-surface-card border border-border-control rounded-lg px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:border-primary-container"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="bg-surface-card border border-border-standard rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-surface-secondary text-primary mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">search_off</span>
              </div>
              <h3 className="text-base font-semibold text-text-contrast">No masterclasses found</h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                No matching results for your current filters. Try changing or resetting your search keywords.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-lg bg-surface-interactive text-text-primary text-xs font-semibold hover:bg-surface-elevated transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
