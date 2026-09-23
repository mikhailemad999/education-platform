import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourseStore, useAuthStore } from '../../store';
import { Section, Lecture, Course } from '../../types';
import { Modal } from '../../components/common/Modal';

export const CourseBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const addCourse = useCourseStore((state) => state.addCourse);
  const updateCourse = useCourseStore((state) => state.updateCourse);
  const getCourseById = useCourseStore((state) => state.getCourseById);
  const categories = useCourseStore((state) => state.categories);

  const existing = id ? getCourseById(id) : null;

  const [currentStep, setCurrentStep] = useState<number>(3); // Default to curriculum studio as in Stitch!
  const [title, setTitle] = useState(existing?.title || 'Advanced Linux Kernel Observability & eBPF Telemetry');
  const [subtitle, setSubtitle] = useState(existing?.subtitle || 'Extract kernel tracepoints and build high-performance network filters.');
  const [description, setDescription] = useState(existing?.description || 'Production masterclass exploring eBPF programs loaded into kernel space.');
  const [price, setPrice] = useState(existing?.price || 99.99);
  const [originalPrice, setOriginalPrice] = useState(existing?.originalPrice || 179.99);
  const [categoryId, setCategoryId] = useState(existing?.categoryId || 'cat-4');
  const [level, setLevel] = useState<Course['level']>(existing?.level || 'Advanced');
  const [thumbnail, setThumbnail] = useState(existing?.thumbnail || 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80');

  const [sections, setSections] = useState<Section[]>(
    existing?.sections && existing.sections.length > 0
      ? existing.sections
      : [
          {
            id: 'sec-new-1',
            courseId: 'course-new',
            title: 'Section 01 — eBPF Architecture & Kernel Verifier',
            sortOrder: 1,
            lectures: [
              {
                id: 'lec-new-1',
                sectionId: 'sec-new-1',
                title: '01. Anatomy of the BPF Virtual Machine',
                contentType: 'video',
                contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                duration: '20:10',
                sortOrder: 1,
                isPreview: true
              },
              {
                id: 'lec-new-2',
                sectionId: 'sec-new-1',
                title: '02. Kernel Hookpoints & Tracepoints Reference',
                contentType: 'pdf',
                contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                duration: '32 pages',
                sortOrder: 2,
                pdfDownloadable: true
              }
            ]
          }
        ]
  );

  // File upload simulation modal state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'video' | 'pdf'>('video');
  const [uploadTargetSectionId, setUploadTargetSectionId] = useState<string>('');
  const [lectureTitleInput, setLectureTitleInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAddSection = () => {
    const newSec: Section = {
      id: `sec-${Date.now()}`,
      courseId: existing?.id || 'course-new',
      title: `Section 0${sections.length + 1} — New Architectural Module`,
      sortOrder: sections.length + 1,
      lectures: []
    };
    setSections([...sections, newSec]);
  };

  const openUploadModal = (sectionId: string, type: 'video' | 'pdf') => {
    setUploadTargetSectionId(sectionId);
    setUploadType(type);
    setLectureTitleInput(type === 'video' ? 'New Video Lecture' : 'Production Reference Blueprint');
    setUploadProgress(0);
    setIsUploading(true);
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      setUploadProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Add lecture to target section
          setSections((prev) =>
            prev.map((s) => {
              if (s.id === uploadTargetSectionId) {
                const newLec: Lecture = {
                  id: `lec-${Date.now()}`,
                  sectionId: s.id,
                  title: lectureTitleInput,
                  contentType: uploadType,
                  contentUrl:
                    uploadType === 'video'
                      ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
                      : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                  duration: uploadType === 'video' ? '18:30' : '15 pages',
                  sortOrder: s.lectures.length + 1,
                  pdfDownloadable: uploadType === 'pdf'
                };
                return { ...s, lectures: [...s.lectures, newLec] };
              }
              return s;
            })
          );
          setIsUploading(false);
        }, 500);
      }
    }, 200);
  };

  const handleSaveAndPublish = (status: 'draft' | 'published') => {
    const cat = categories.find((c) => c.id === categoryId);
    const courseData: Course = {
      id: existing?.id || `course-${Date.now()}`,
      title,
      subtitle,
      description,
      price,
      originalPrice,
      instructorId: user?.id || 'user-instructor-1',
      instructorName: user?.name || 'Faculty Member',
      instructorTitle: user?.title || 'Principal Architect',
      instructorAvatar: user?.avatar || '',
      categoryId,
      categoryName: cat?.name || 'Distributed Systems',
      status,
      rating: existing?.rating || 5.0,
      reviewCount: existing?.reviewCount || 1,
      enrolledStudents: existing?.enrolledStudents || 0,
      level,
      duration: '18 hours',
      thumbnail,
      promoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      whatYouWillLearn: [
        'Production grade implementation',
        'Kernel tracepoints and low overhead filters'
      ],
      prerequisites: ['Prior backend experience'],
      sections,
      createdAt: existing?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (existing?.id) {
      updateCourse(existing.id, courseData);
    } else {
      addCourse(courseData);
    }

    navigate('/instructor/dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Top Autosave Bar */}
      <div className="bg-surface-card border border-border-standard rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-14 z-20 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-warning animate-pulse"></span>
            <span className="text-[11px] font-mono text-status-warning uppercase font-bold">
              Draft v2.4 (Unpublished Changes)
            </span>
          </div>
          <h2 className="text-sm font-bold text-text-contrast mt-0.5 truncate max-w-lg">
            Editing: <span className="text-text-primary">{title}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSaveAndPublish('draft')}
            className="px-3.5 py-1.5 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-secondary hover:text-text-primary text-xs font-semibold border border-border-control transition-colors"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSaveAndPublish('published')}
            className="px-4 py-1.5 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span>Publish Masterclass</span>
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
          </button>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="bg-surface-container-low border border-border-subtle rounded-xl p-3 overflow-x-auto">
        <ol className="flex items-center justify-between min-w-[650px] gap-2 text-xs">
          {[
            { step: 1, label: '1. Course Basics' },
            { step: 2, label: '2. Media & Pricing' },
            { step: 3, label: '3. Curriculum Studio' },
            { step: 4, label: '4. Quality Review' }
          ].map((s) => (
            <li
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                currentStep === s.step
                  ? 'text-primary font-bold'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs ${
                  currentStep === s.step
                    ? 'bg-primary-container text-white'
                    : 'bg-surface-container-high text-text-muted'
                }`}
              >
                {s.step}
              </div>
              <span>{s.label}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Step 1: Basics */}
      {currentStep === 1 && (
        <div className="bg-surface-card border border-border-standard rounded-2xl p-6 sm:p-8 space-y-4 max-w-3xl text-xs">
          <h3 className="text-base font-bold text-text-contrast">Step 1: Course Basics</h3>
          <div className="space-y-1">
            <label className="text-text-secondary font-semibold">Course Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-secondary border border-border-control rounded-lg p-3 text-text-primary focus:outline-none focus:border-primary-container font-medium"
            />
          </div>
          <div className="space-y-1">
            <label className="text-text-secondary font-semibold">Subtitle / Tagline</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-surface-secondary border border-border-control rounded-lg p-3 text-text-primary focus:outline-none focus:border-primary-container"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-text-secondary font-semibold">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-surface-secondary border border-border-control rounded-lg p-3 text-text-primary focus:outline-none focus:border-primary-container"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-text-secondary font-semibold">Experience Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full bg-surface-secondary border border-border-control rounded-lg p-3 text-text-primary focus:outline-none focus:border-primary-container"
              >
                <option value="All Levels">All Levels</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Media & Pricing */}
      {currentStep === 2 && (
        <div className="bg-surface-card border border-border-standard rounded-2xl p-6 sm:p-8 space-y-4 max-w-3xl text-xs">
          <h3 className="text-base font-bold text-text-contrast">Step 2: Media & Pricing</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-text-secondary font-semibold">Listing Price ($ USD)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-surface-secondary border border-border-control rounded-lg p-3 text-text-primary font-mono focus:outline-none focus:border-primary-container"
              />
            </div>
            <div className="space-y-1">
              <label className="text-text-secondary font-semibold">Original Price ($ USD)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full bg-surface-secondary border border-border-control rounded-lg p-3 text-text-primary font-mono focus:outline-none focus:border-primary-container"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-text-secondary font-semibold">Cover Thumbnail URL</label>
            <input
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full bg-surface-secondary border border-border-control rounded-lg p-3 text-text-primary font-mono focus:outline-none focus:border-primary-container"
            />
          </div>
        </div>
      )}

      {/* Step 3: Curriculum Studio (Drag / Reorder Sections & Lectures) */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text-contrast">
                Interactive Curriculum Studio
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Organize sections, upload high-definition video lectures (up to 60 mins), and attach lab PDFs.
              </p>
            </div>

            <button
              onClick={handleAddSection}
              className="px-3.5 py-2 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-primary text-xs font-semibold border border-border-control transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm text-primary">add</span>
              <span>Add New Section</span>
            </button>
          </div>

          {/* Section Blocks */}
          <div className="space-y-5">
            {sections.map((section, sIdx) => (
              <div
                key={section.id}
                className="bg-surface-card border border-border-standard rounded-2xl p-5 space-y-4 shadow-lg"
              >
                {/* Section Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="material-symbols-outlined text-text-muted text-base cursor-grab">
                      drag_indicator
                    </span>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setSections((prev) =>
                          prev.map((s) => (s.id === section.id ? { ...s, title: newTitle } : s))
                        );
                      }}
                      className="bg-transparent border-b border-border-control px-2 py-1 text-xs sm:text-sm font-bold text-text-contrast focus:outline-none focus:border-primary-container flex-1 max-w-md"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openUploadModal(section.id, 'video')}
                      className="px-2.5 py-1.5 rounded-lg bg-primary-container/15 hover:bg-primary-container hover:text-white text-primary text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">video_call</span>
                      <span>+ Video</span>
                    </button>
                    <button
                      onClick={() => openUploadModal(section.id, 'pdf')}
                      className="px-2.5 py-1.5 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-secondary hover:text-text-primary text-xs font-semibold border border-border-control transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">post_add</span>
                      <span>+ PDF</span>
                    </button>
                  </div>
                </div>

                {/* Lecture Rows */}
                <div className="space-y-2">
                  {section.lectures.length === 0 ? (
                    <div className="p-6 text-center text-xs text-text-muted border border-dashed border-border-control rounded-xl">
                      No lectures added yet. Click "+ Video" or "+ PDF" above.
                    </div>
                  ) : (
                    section.lectures.map((lec) => (
                      <div
                        key={lec.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary border border-border-subtle hover:border-border-control text-xs transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="material-symbols-outlined text-text-muted text-base cursor-grab shrink-0">
                            drag_handle
                          </span>
                          <span className="material-symbols-outlined text-primary text-base shrink-0">
                            {lec.contentType === 'video' ? 'play_circle' : 'description'}
                          </span>
                          <span className="font-medium text-text-contrast truncate">{lec.title}</span>
                          <span className="text-[10px] font-mono text-text-muted shrink-0">
                            ({lec.duration})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {lec.isPreview && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-primary-container/20 text-primary">
                              PREVIEW
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setSections((prev) =>
                                prev.map((s) =>
                                  s.id === section.id
                                    ? { ...s, lectures: s.lectures.filter((l) => l.id !== lec.id) }
                                    : s
                                )
                              );
                            }}
                            className="p-1 rounded text-text-muted hover:text-status-danger transition-colors"
                            title="Remove Lecture"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Quality Review */}
      {currentStep === 4 && (
        <div className="bg-surface-card border border-border-standard rounded-2xl p-6 sm:p-8 space-y-4 max-w-3xl text-xs">
          <h3 className="text-base font-bold text-text-contrast">Step 4: Quality Verification</h3>
          <div className="p-4 rounded-xl bg-status-success/10 border border-status-success/30 text-status-success space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>Telemetry Checks Passed</span>
            </div>
            <p className="text-text-secondary text-[11px]">
              All lectures contain valid media URLs. Duration conforms to the 60-minute per-lesson rule.
            </p>
          </div>
          <button
            onClick={() => handleSaveAndPublish('published')}
            className="w-full py-3 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Publish Masterclass to Global Catalog</span>
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
          </button>
        </div>
      )}

      {/* Video & PDF Upload Simulator Modal */}
      <Modal
        isOpen={isUploading}
        onClose={() => setIsUploading(false)}
        title={uploadType === 'video' ? 'Upload Masterclass Video Lesson' : 'Upload Lab Document PDF'}
        footer={
          <button
            onClick={handleSimulateUpload}
            className="px-4 py-2 rounded-lg bg-primary-container text-white text-xs font-semibold"
          >
            {uploadProgress > 0 ? `Uploading (${uploadProgress}%)` : 'Start Upload'}
          </button>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-text-secondary font-medium">Lecture Title</label>
            <input
              type="text"
              value={lectureTitleInput}
              onChange={(e) => setLectureTitleInput(e.target.value)}
              className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-primary-container"
            />
          </div>

          {/* Limits Notice from Product Requirements */}
          <div className="p-3 rounded-lg bg-surface-secondary border border-border-subtle text-text-muted space-y-1 text-[11px] font-mono">
            <div className="text-primary font-semibold">SPECIFICATION RESTRICTIONS:</div>
            <div>• Maximum duration: 60 minutes per lesson</div>
            <div>• Supported formats: MP4, WebM (H.264/AAC encoded) or PDF (vector rendered)</div>
            <div>• Direct-to-object-storage encryption enabled</div>
          </div>

          {/* Upload Progress Bar */}
          {uploadProgress > 0 && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-mono">
                <span>Encoding & Transcoding</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
                <div
                  className="h-full bg-primary-container rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
