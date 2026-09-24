import React, { useState } from 'react';
import { useCourseStore } from '../../store';
import { Category } from '../../types';
import { Modal } from '../../components/common/Modal';

const AVAILABLE_ICONS = [
  { name: 'hub', label: 'Distributed Hub' },
  { name: 'terminal', label: 'Backend Terminal' },
  { name: 'cloud_sync', label: 'Cloud Infrastructure' },
  { name: 'memory', label: 'Systems & Hardware' },
  { name: 'neurology', label: 'AI & Neural Networks' },
  { name: 'shield_lock', label: 'Security & Crypto' },
  { name: 'database', label: 'Databases & Storage' },
  { name: 'lan', label: 'High-Speed Networking' },
  { name: 'analytics', label: 'Telemetry & MLOps' },
  { name: 'deployed_code', label: 'Microservices & CI/CD' }
];

export const AdminCategoriesPage: React.FC = () => {
  const categories = useCourseStore((state) => state.categories);
  const courses = useCourseStore((state) => state.courses);
  const addCategory = useCourseStore((state) => state.addCategory);
  const updateCategory = useCourseStore((state) => state.updateCategory);
  const deleteCategory = useCourseStore((state) => state.deleteCategory);

  const [search, setSearch] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formIcon, setFormIcon] = useState('hub');

  const handleOpenCreate = () => {
    setFormName('');
    setFormSlug('');
    setFormIcon('hub');
    setShowCreateModal(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormIcon(cat.icon);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      setFormSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: formName.trim(),
      slug: formSlug.trim() || formName.toLowerCase().replace(/\s+/g, '-'),
      icon: formIcon,
      courseCount: 0
    };

    addCategory(newCat);
    setShowCreateModal(false);
    setActionNotice(`Category "${newCat.name}" successfully created in platform taxonomy.`);
    setTimeout(() => setActionNotice(''), 3500);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !formName.trim()) return;

    updateCategory(editingCategory.id, {
      name: formName.trim(),
      slug: formSlug.trim() || editingCategory.slug,
      icon: formIcon
    });

    setEditingCategory(null);
    setActionNotice(`Category "${formName.trim()}" updated successfully.`);
    setTimeout(() => setActionNotice(''), 3500);
  };

  const handleConfirmDelete = () => {
    if (!deletingCategory) return;
    const catCourses = courses.filter((c) => c.categoryId === deletingCategory.id);
    if (catCourses.length > 0) {
      alert(`Cannot delete category "${deletingCategory.name}" because ${catCourses.length} active course(s) belong to it. Please reassign the courses first.`);
      setDeletingCategory(null);
      return;
    }

    deleteCategory(deletingCategory.id);
    setActionNotice(`Category "${deletingCategory.name}" removed from platform taxonomy.`);
    setDeletingCategory(null);
    setTimeout(() => setActionNotice(''), 3500);
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const totalCourseCount = courses.length;

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-standard">
        <div>
          <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
            Instructional Taxonomies
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
            Category & Curriculum Taxonomy Management
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Define disciplinary tracks, configure domain icons, and structure the engineering curriculum hierarchy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Create New Category</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-status-success/10 border border-status-success/30 text-status-success text-xs flex items-center gap-2 animate-fade-in font-medium">
          <span className="material-symbols-outlined text-base">verified</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Active Categories</span>
          <div className="text-2xl font-bold font-mono text-text-contrast">{categories.length}</div>
          <span className="text-[11px] text-primary font-mono">100% indexed in search</span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Total Catalog Courses</span>
          <div className="text-2xl font-bold font-mono text-text-contrast">{totalCourseCount}</div>
          <span className="text-[11px] text-text-muted font-mono">Across all engineering tracks</span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Top Track by Courses</span>
          <div className="text-lg font-bold text-text-contrast truncate">
            {categories[0]?.name || 'Distributed Systems'}
          </div>
          <span className="text-[11px] text-status-success font-mono">
            {categories[0]?.courseCount || 14} courses active
          </span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Taxonomy Integrity</span>
          <div className="text-2xl font-bold font-mono text-status-success">100%</div>
          <span className="text-[11px] text-text-muted font-mono">All slugs verified</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-base">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category or slug..."
            className="w-full bg-surface-card border border-border-standard rounded-xl pl-9 pr-3.5 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container"
          />
        </div>

        <div className="text-xs text-text-muted font-mono">
          Showing <strong className="text-text-contrast">{filteredCategories.length}</strong> of{' '}
          {categories.length} categories
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => {
          const associatedCourses = courses.filter((c) => c.categoryId === cat.id);
          const liveCourseCount = associatedCourses.length || cat.courseCount;

          return (
            <div
              key={cat.id}
              className="bg-surface-card border border-border-standard hover:border-primary-container/60 rounded-2xl p-5 space-y-4 transition-all duration-200 shadow-lg relative group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-border-standard flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-md">
                    <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-contrast group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] font-mono text-text-muted">
                      /{cat.slug}
                    </span>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-primary-container/15 text-primary text-[10px] font-mono font-bold">
                  {liveCourseCount} COURSES
                </div>
              </div>

              {/* Associated Courses Snippet */}
              <div className="bg-surface-secondary/60 rounded-xl p-3 border border-border-subtle text-xs space-y-1">
                <span className="text-[10px] font-mono uppercase text-text-muted tracking-wider">
                  Associated Courses:
                </span>
                {associatedCourses.length > 0 ? (
                  <ul className="space-y-1 pt-1">
                    {associatedCourses.slice(0, 2).map((c) => (
                      <li key={c.id} className="text-text-secondary truncate flex items-center gap-1.5 text-[11px]">
                        <span className="w-1 h-1 rounded-full bg-primary"></span>
                        <span className="truncate">{c.title}</span>
                      </li>
                    ))}
                    {associatedCourses.length > 2 && (
                      <li className="text-[10px] text-text-muted italic">
                        +{associatedCourses.length - 2} additional masterclasses
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-[11px] text-text-muted italic pt-1">
                    No active masterclasses currently assigned
                  </p>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="px-3 py-1.5 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-secondary hover:text-text-contrast text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeletingCategory(cat)}
                  className="px-3 py-1.5 rounded-lg bg-status-error/10 hover:bg-status-error/20 text-status-error text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Category */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Educational Category"
      >
        <form onSubmit={handleSaveCreate} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-text-secondary font-medium">Category Name</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. High-Performance C++ & Game Engines"
              className="w-full bg-surface-card border border-border-control rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary-container"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-text-secondary font-medium">URL Slug (Kebab Case)</label>
            <input
              type="text"
              required
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              placeholder="e.g. high-performance-cpp"
              className="w-full bg-surface-card border border-border-control rounded-lg px-3 py-2 text-text-primary font-mono focus:outline-none focus:border-primary-container"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-text-secondary font-medium">Select Taxonomy Icon</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {AVAILABLE_ICONS.map((ic) => (
                <button
                  type="button"
                  key={ic.name}
                  onClick={() => setFormIcon(ic.name)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    formIcon === ic.name
                      ? 'bg-primary-container/20 border-primary-container text-primary font-bold shadow-sm'
                      : 'bg-surface-secondary border-border-control text-text-muted hover:text-text-contrast hover:bg-surface-interactive'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{ic.name}</span>
                  <span className="text-[10px] truncate max-w-[70px]">{ic.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-lg bg-surface-secondary text-text-muted hover:text-text-contrast"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary-container hover:brightness-110 text-white font-semibold shadow-md"
            >
              Create Category
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Category */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title={`Edit Category: ${editingCategory?.name}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-text-secondary font-medium">Category Name</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full bg-surface-card border border-border-control rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary-container"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-text-secondary font-medium">URL Slug</label>
            <input
              type="text"
              required
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              className="w-full bg-surface-card border border-border-control rounded-lg px-3 py-2 text-text-primary font-mono focus:outline-none focus:border-primary-container"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-text-secondary font-medium">Select Taxonomy Icon</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {AVAILABLE_ICONS.map((ic) => (
                <button
                  type="button"
                  key={ic.name}
                  onClick={() => setFormIcon(ic.name)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    formIcon === ic.name
                      ? 'bg-primary-container/20 border-primary-container text-primary font-bold shadow-sm'
                      : 'bg-surface-secondary border-border-control text-text-muted hover:text-text-contrast hover:bg-surface-interactive'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{ic.name}</span>
                  <span className="text-[10px] truncate max-w-[70px]">{ic.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="px-4 py-2 rounded-lg bg-surface-secondary text-text-muted hover:text-text-contrast"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary-container hover:brightness-110 text-white font-semibold shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Delete Confirmation */}
      <Modal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title="Confirm Category Deletion"
      >
        <div className="space-y-4 text-xs">
          <p className="text-text-secondary">
            Are you sure you want to delete the category{' '}
            <strong className="text-text-contrast">"{deletingCategory?.name}"</strong>?
          </p>
          <div className="p-3 rounded-lg bg-status-warning/10 border border-status-warning/30 text-status-warning">
            Note: Deletion will fail if any active courses are currently assigned to this category.
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeletingCategory(null)}
              className="px-4 py-2 rounded-lg bg-surface-secondary text-text-muted hover:text-text-contrast"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-lg bg-status-error hover:brightness-110 text-white font-semibold shadow-md"
            >
              Delete Category
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
