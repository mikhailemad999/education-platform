import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { PublicHeader } from './components/layout/PublicHeader';
import { DashboardSidebar } from './components/layout/DashboardSidebar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import { HomePage } from './pages/public/HomePage';
import { SearchPage } from './pages/public/SearchPage';
import { CourseDetailPage } from './pages/public/CourseDetailPage';
import { PricingPage } from './pages/public/PricingPage';
import { AuthGatewayPage } from './pages/auth/AuthGatewayPage';
import { StaffLoginPage } from './pages/auth/StaffLoginPage';
import { AccessDeniedPage } from './pages/auth/AccessDeniedPage';

import { CheckoutPage } from './pages/student/CheckoutPage';
import { MyCoursesPage } from './pages/student/MyCoursesPage';
import { LearningPlayerPage } from './pages/student/LearningPlayerPage';
import { CertificatePage } from './pages/student/CertificatePage';
import { BillingPage } from './pages/student/BillingPage';

import { InstructorDashboardPage } from './pages/instructor/InstructorDashboardPage';
import { CourseBuilderPage } from './pages/instructor/CourseBuilderPage';
import { InstructorAnalyticsPage } from './pages/instructor/InstructorAnalyticsPage';
import { InstructorReviewsPage } from './pages/instructor/InstructorReviewsPage';

import { AdminConsolePage } from './pages/admin/AdminConsolePage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminInstructorsPage } from './pages/admin/AdminInstructorsPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';

import { SuperAdminConsolePage } from './pages/superadmin/SuperAdminConsolePage';
import { SuperAdminSettingsPage } from './pages/superadmin/SuperAdminSettingsPage';
import { AuditLogsPage } from './pages/superadmin/AuditLogsPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const isPlayer = location.pathname.startsWith('/learn/');
  const isDashboard =
    location.pathname.startsWith('/instructor') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/superadmin');

  if (isPlayer) {
    return <div className="min-h-screen bg-bg-canvas text-on-surface">{children}</div>;
  }

  if (isDashboard) {
    return (
      <div className="min-h-screen bg-bg-canvas text-on-surface flex flex-col">
        {/* Mobile / Tablet Dashboard Topbar */}
        <header className="lg:hidden h-14 bg-surface-container-lowest border-b border-border-standard px-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg bg-surface-card border border-border-standard text-text-contrast hover:border-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-lg">menu</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-surface-card border border-border-standard flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-base">token</span>
            </div>
            <span className="font-title-sm tracking-tight text-text-contrast uppercase font-bold text-xs">
              Obsidian<span className="text-primary-container">.ops</span>
            </span>
          </div>
          <div className="w-8"></div>
        </header>

        <div className="flex flex-1 relative">
          <DashboardSidebar
            isOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
          />
          <main className="flex-1 w-full lg:ml-64 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen">
            <div className="max-w-7xl mx-auto w-full">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  // Public & Student Standard Layout
  return (
    <div className="min-h-screen bg-bg-canvas text-on-surface flex flex-col">
      <PublicHeader />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* Public & Catalog */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/pricing" element={<PricingPage />} />

          {/* Authentication & Gateway Routes */}
          <Route path="/auth/login" element={<AuthGatewayPage />} />
          <Route path="/auth/register" element={<AuthGatewayPage />} />
          <Route path="/login" element={<AuthGatewayPage />} />
          <Route path="/register" element={<AuthGatewayPage />} />
          <Route path="/portal/login" element={<StaffLoginPage />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />

          {/* Student Portal (Protected: Student only) */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-courses"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyCoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/:courseId/lecture/:lectureId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <LearningPlayerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates/:id"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <CertificatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/billing"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor']}>
                <BillingPage />
              </ProtectedRoute>
            }
          />

          {/* Faculty / Instructor Studio (Protected: Instructor only) */}
          <Route
            path="/instructor"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <InstructorDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <InstructorDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/new"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <CourseBuilderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <CourseBuilderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/analytics"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <InstructorAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/reviews"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <InstructorReviewsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Operations Hub (Protected: Admin only) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminConsolePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/instructors"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminInstructorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCoursesPage />
              </ProtectedRoute>
            }
          />

          {/* SuperAdmin Master Core (Protected: SuperAdmin only) */}
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminConsolePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/payments"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminConsolePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/settings"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/audit-logs"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <AuditLogsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
