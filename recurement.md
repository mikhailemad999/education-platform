# Platform Features and Data Model

A Udemy-like platform offers a rich set of course-related features. Students can watch **video lectures**, read **article/PDF lectures**, take quizzes and practice tests, access supplemental resources, and receive certificates upon completion. They can participate in course Q&A and post reviews, and search or filter courses by category. Instructors get a dedicated **Instructor Dashboard**: Udemy’s dashboard lists all of an instructor’s courses along with key metrics (monthly enrollments, ratings, earnings). It includes pages for **Performance (overview of revenue/enrollments)**, **Students** (demographics), **Reviews** (view/respond), and **Engagement** (course consumption stats).  

In our design, core data models include **User** (with roles), **Course** (title, description, price, instructor, etc.), **Section** (group of lectures), **Lecture** (video or PDF files), **Category**, **Enrollment** (joins students with courses), **Payment/Subscription**, and optionally **Quiz/Assignment** tables. Each Course is linked to one Instructor (user) and one Category; a Course has many Sections/Lectures. An Enrollment record ties a Student to a Course (or Subscription plan). Payment records capture transactions (amount, method, status) tied to Users and Courses or Subscriptions. The schema ensures referential integrity (e.g. foreign keys from Lecture→Course, Course→Instructor, Enrollment→(User,Course)). 

# User Roles and Permissions

Key roles are:

- **Student (Learner)** – can browse courses, view course details, enroll in courses, access purchased or subscribed courses, take quizzes, and manage their profile. (Unauthenticated guests can view course catalogs but must register/buy to enroll.)
- **Instructor** – can create and manage their own courses: upload lecture videos/PDFs, organize sections, set pricing, and publish content. They can view their course analytics (enrollments, revenue, ratings) via the Instructor Dashboard. Instructors cannot modify or view other instructors’ courses.
- **Admin** – has a course and user management console. An admin can add/remove instructors (approving or suspending instructor accounts), moderate or delete courses, manage categories, and view site-wide statistics. Admins see dashboards for overall platform metrics (total users, total sales, etc.) but typically **not** financial payout details.
- **SuperAdmin** – has all Admin privileges plus full system control. A super-admin can manage **all** users, instructors and admins; view/adjust financial and subscription settings; cancel subscriptions or orders; and configure site-wide parameters. For example, they can create new Admin accounts or disable subscriptions. In effect, the superadmin is like the “owner” with unrestricted access.

Each page or API endpoint enforces these roles. For instance, only Instructors can call course-creation APIs, while admin pages are restricted to admin/superadmin roles.

# Pages and Navigation

Key pages/routes of the platform include:

- **`/` (Main Home/Catalog)** – Public landing page showing featured courses, categories, and search. Functions: course browsing/search, promotional banners. Structure: header/navigation, search bar, featured courses carousel, course grid, footer.
- **`/courses/{id}` (Course Detail)** – Shows a specific course’s syllabus, promo video, instructor info, price, and “Buy Now” or “Enroll” button. Functions: display lectures list (locked/unlocked), preview content, enroll/checkout trigger.
- **`/search`** – Course search results (filter by category, skill, price, etc.).
- **`/my-courses`** – Student’s dashboard of enrolled courses. Functions: list of courses the user has access to, progress tracking, resume lecture.
- **`/checkout`** – Payment page where students enter payment info to purchase courses or subscriptions.
- **`/instructor`** – Instructor portal. Default might be `/instructor/dashboard` showing all their courses (with enrollments, ratings, earnings). Sub-pages include `/instructor/course/new`, `/instructor/course/{id}/edit` (upload lectures, PDFs; manage pricing), and `/instructor/course/{id}/stats`.
- **`/admin`** – Admin console. Functions: user management (`/admin/users`), instructor management (`/admin/instructors`), course moderation (`/admin/courses`), site stats (`/admin/stats`), category management, etc. Admin can add or remove instructor accounts and view aggregated usage stats.
- **`/superadmin`** – Super-admin portal. In addition to admin functions, includes finance/subscription management. For example `/superadmin/payments` to view all transactions, `/superadmin/users` to manage any account, and tools to cancel subscriptions or create new Admin roles. This page is only accessible to the superadmin role.

These pages map to the roles: students use the public pages and their “my-courses” page; instructors use the `/instructor` routes; admins use `/admin`; super-admin uses `/superadmin`. Role-based guards in NestJS will restrict access accordingly.

# Data Model (Database Schema)

The MySQL schema might include tables like:

- **users**: id, name, email, password_hash, role (enum: student/instructor/admin/superadmin), status, created_at.
- **categories**: id, name.
- **courses**: id, title, description, price, instructor_id (FK to users), category_id, created_at, status (draft/published).
- **sections**: id, course_id (FK), title, sort_order.
- **lectures**: id, section_id (FK), title, content_type (video/pdf), content_url, duration, sort_order.
- **enrollments**: id, user_id (FK), course_id (FK), status (active/completed), enrolled_at.
- **payments**: id, user_id (FK), course_id (FK, nullable if subscription), subscription_id (FK, if subscription model), amount, currency, method (credit_card/check), status (pending/paid/failed), transaction_date.
- **subscriptions** (if offering subscription plans): id, name, price, duration (months), etc.
- **user_subscriptions**: id, user_id, subscription_id, start_date, end_date, status.

Relations: One user (instructor) → many courses. One course → many sections → many lectures. One student → many enrollments. Payments link to enrollments or subscriptions. This normalized design supports efficient queries (e.g. fetch all lectures for a course, all courses by instructor, etc.).

# API Endpoints (NestJS Controllers)

Design RESTful API endpoints with appropriate guards:

- **Auth**: 
  - `POST /auth/register` (register as student or instructor; instructors may require approval).
  - `POST /auth/login` (issue JWT).
- **Users**: 
  - `GET /users/me` (get profile), 
  - `PUT /users/me` (update profile). 
  - Admin-only: `GET /users`, `PUT /users/:id`, `DELETE /users/:id`.
- **Courses**: 
  - `GET /courses` (list/paginate/filter available courses), 
  - `GET /courses/:id` (course details). 
  - Instructor (or Admin) only: `POST /instructor/courses` (create course), `PUT /instructor/courses/:id` (update), `DELETE /instructor/courses/:id`.
- **Sections/Lectures**: 
  - Instructor-only nested routes, e.g. `POST /instructor/courses/:courseId/sections`, `POST /instructor/sections/:sectionId/lectures`, etc.
- **Enrollments/Checkout**: 
  - `POST /courses/:id/enroll` (initiates purchase for that course; processes payment). 
  - `GET /users/me/enrollments` (student’s enrolled courses).
- **Payments**: 
  - `POST /payments/credit-card` (submit credit card token to Stripe, etc.), 
  - `POST /payments/check` (mark a check/invoice payment). 
  - Webhook endpoint like `POST /payments/webhook` (to handle payment gateway notifications).
- **Instructor Stats**: 
  - `GET /instructor/courses/:id/stats` (returns enrollments, revenue for that course).
- **Admin**: 
  - `GET /admin/users` (list all users), 
  - `GET /admin/instructors` (list instructor accounts),
  - `GET /admin/stats` (site-wide metrics). 
  - `POST /admin/instructors` (approve new instructor), etc.
- **SuperAdmin**: 
  - `GET /superadmin/payments` (all transactions), 
  - `PUT /superadmin/subscriptions/:id/cancel`, 
  - `POST /superadmin/admins` (create new admin user), etc.

Each endpoint enforces permissions via NestJS guards (JWT + role-check). For example, `/instructor/*` routes check the user’s role is `instructor`, and `/admin/*` routes check `admin` or `superadmin`, while `/superadmin/*` checks `superadmin`.

# Payment Flows (Credit Card and Check)

**Credit Card (Online Payment):** When a student buys a course or subscribes, the front-end collects payment details (via Stripe.js or similar) and calls our backend (e.g. `POST /payments/credit-card`) with the payment token. The backend creates a charge or subscription via a payment gateway (Stripe/PayPal). On success, we create the Enrollment (or UserSubscription) record and set payment status to “paid”, immediately granting course access. If using Stripe, a webhook listener (e.g. `/payments/webhook`) can handle asynchronous events (charge succeeded, subscription renewal, failed payment). Major cards (Visa, Mastercard, AmEx, etc.) are supported as Udemy does.

**Check (Offline Payment):** If a student chooses “pay by check”, the system creates a pending order and provides an invoice or payment instructions. The Enrollment remains in a “pending” status until the check is received and manually verified by an admin. Once payment is confirmed (admin updates payment record to “paid”), the student’s Enrollment is activated and they gain access. (Udemy supports similar offline options: e.g. in some regions they allow cash/bank transfers.) 

**Subscription Plans (SaaS Model):** For a SaaS model, the student can subscribe to a monthly/annual plan instead of buying individual courses. The flow is similar: `POST /payments/subscribe` creates a recurring subscription via Stripe. Stripe returns a Subscription ID which we store. On each billing period, Stripe charges the card; success keeps the UserSubscription “active”. The student has access to courses while subscription is active. The user or admin can cancel the subscription via the API (`/subscriptions/:id/cancel`). Cancelling stops future charges and may revoke access at period-end.

In all cases we record the payment method (credit_card or check) and status. For credit cards we rely on secure gateway processing, while for checks we flag payment as manual and require admin intervention.

# JSON Specification of Pages and Data

The JSON below outlines the main pages/routes, their functions, user roles, and key data structures. This is a high-level specification of the platform architecture:

```json
{
  "roles": [
    {
      "name": "student",
      "permissions": ["view_courses", "search", "enroll_course", "view_own_enrollments", "post_review"]
    },
    {
      "name": "instructor",
      "permissions": ["create_course", "upload_content", "publish_course", "view_own_course_stats", "respond_QA"]
    },
    {
      "name": "admin",
      "permissions": ["manage_instructors", "moderate_courses", "view_site_stats"]
    },
    {
      "name": "superadmin",
      "permissions": ["manage_users", "manage_admins", "manage_finances", "cancel_subscriptions", "all_admin_permissions"]
    }
  ],
  "pages": [
    {
      "path": "/",
      "title": "Home",
      "description": "Main landing page showing featured and new courses, categories and search.",
      "functions": ["browse_courses", "search_courses", "view_categories"],
      "components": ["Header", "SearchBar", "FeaturedCarousel", "CourseGrid", "Footer"]
    },
    {
      "path": "/courses/:id",
      "title": "Course Detail",
      "description": "Detailed page for a specific course, with syllabus, previews, and enroll button.",
      "functions": ["view_syllabus", "watch_preview", "add_to_cart"],
      "components": ["CourseTitle", "InstructorInfo", "PromoVideo", "LectureList", "ReviewsSection", "EnrollButton"]
    },
    {
      "path": "/search",
      "title": "Search Results",
      "description": "List of courses matching search query or filters.",
      "functions": ["filter_courses", "sort_results"],
      "components": ["SearchResultsList", "CategoryFilter", "SortOptions"]
    },
    {
      "path": "/my-courses",
      "title": "My Courses",
      "description": "Dashboard listing all courses the student is enrolled in.",
      "functions": ["view_enrolled_courses", "resume_lecture"],
      "components": ["EnrolledCourseCard", "ProgressTracker", "ProfileMenu"]
    },
    {
      "path": "/checkout",
      "title": "Checkout",
      "description": "Payment page where users complete purchase of courses or subscriptions.",
      "functions": ["apply_coupon", "enter_payment", "confirm_order"],
      "components": ["OrderSummary", "PaymentForm", "BillingDetails"]
    },
    {
      "path": "/instructor/dashboard",
      "title": "Instructor Dashboard",
      "description": "Instructor home showing all their courses and summary stats.",
      "functions": ["list_own_courses", "view_monthly_earnings"],
      "components": ["CourseList", "EarningsChart", "Notifications"]
    },
    {
      "path": "/instructor/course/new",
      "title": "Create Course",
      "description": "Form where instructor can enter course info (title, description, price).",
      "functions": ["enter_course_details", "save_draft", "publish_course"],
      "components": ["CourseForm", "SaveButton", "PublishButton"]
    },
    {
      "path": "/instructor/course/:id",
      "title": "Edit Course",
      "description": "Manage an existing course: sections, lectures, and pricing.",
      "functions": ["add_section", "upload_lecture", "set_price"],
      "components": ["SectionList", "LectureUploader", "PricingEditor"]
    },
    {
      "path": "/instructor/course/:id/stats",
      "title": "Course Stats",
      "description": "Analytics page showing enrollments, revenue, reviews for the course.",
      "functions": ["view_enrollment_trends", "respond_to_reviews"],
      "components": ["EnrollmentChart", "RevenueFigure", "ReviewList"]
    },
    {
      "path": "/admin",
      "title": "Admin Dashboard",
      "description": "Admin home page with site statistics and management shortcuts.",
      "functions": ["view_platform_stats", "navigate_user_management"],
      "components": ["AdminStatsCards", "NavigationMenu"]
    },
    {
      "path": "/admin/users",
      "title": "User Management",
      "description": "List of all users, with ability to add/edit or deactivate.",
      "functions": ["view_users", "edit_user", "delete_user"],
      "components": ["UserTable", "EditUserModal"]
    },
    {
      "path": "/admin/instructors",
      "title": "Instructor Management",
      "description": "Approve or remove instructor accounts.",
      "functions": ["approve_instructor", "remove_instructor"],
      "components": ["InstructorTable", "ApprovalButtons"]
    },
    {
      "path": "/superadmin",
      "title": "SuperAdmin Panel",
      "description": "SuperAdmin area with full controls (finances, subscriptions, admins).",
      "functions": ["create_admin", "cancel_any_subscription", "view_all_payments"],
      "components": ["SuperAdminNav", "PaymentSummary", "SubscriptionList"]
    }
  ],
  "entities": [
    {
      "name": "User",
      "fields": ["id", "name", "email", "password_hash", "role", "status", "created_at"]
    },
    {
      "name": "Category",
      "fields": ["id", "name"]
    },
    {
      "name": "Course",
      "fields": ["id", "title", "description", "price", "instructor_id", "category_id", "status", "created_at"]
    },
    {
      "name": "Section",
      "fields": ["id", "course_id", "title", "sort_order"]
    },
    {
      "name": "Lecture",
      "fields": ["id", "section_id", "title", "content_type", "content_url", "duration", "sort_order"]
    },
    {
      "name": "Enrollment",
      "fields": ["id", "user_id", "course_id", "status", "enrolled_at"]
    },
    {
      "name": "Payment",
      "fields": ["id", "user_id", "course_id", "subscription_id", "amount", "currency", "method", "status", "transaction_date"]
    },
    {
      "name": "Subscription",
      "fields": ["id", "name", "price", "duration_months"]
    },
    {
      "name": "UserSubscription",
      "fields": ["id", "user_id", "subscription_id", "start_date", "end_date", "status"]
    }
  ],
  "api_endpoints": [
    {"method": "POST", "path": "/auth/register", "description": "Register new user (student or instructor)"},
    {"method": "POST", "path": "/auth/login", "description": "User login (returns JWT)"},
    {"method": "GET", "path": "/courses", "description": "Get list of all available courses"},
    {"method": "GET", "path": "/courses/:id", "description": "Get details of a specific course"},
    {"method": "POST", "path": "/instructor/courses", "description": "Instructor creates a new course"},
    {"method": "PUT", "path": "/instructor/courses/:id", "description": "Instructor updates own course"},
    {"method": "POST", "path": "/instructor/courses/:id/sections", "description": "Add section to course"},
    {"method": "POST", "path": "/instructor/sections/:id/lectures", "description": "Add lecture to section"},
    {"method": "POST", "path": "/courses/:id/enroll", "description": "Student initiates purchase/enrollment for a course"},
    {"method": "POST", "path": "/payments/credit-card", "description": "Process credit-card payment via gateway"},
    {"method": "POST", "path": "/payments/check", "description": "Submit pay-by-check request (pending)"},
    {"method": "POST", "path": "/payments/webhook", "description": "Webhook endpoint for payment gateway callbacks"},
    {"method": "GET", "path": "/instructor/courses/:id/stats", "description": "Get analytics for an instructor's course"},
    {"method": "GET", "path": "/admin/users", "description": "Admin: list all users"},
    {"method": "GET", "path": "/admin/instructors", "description": "Admin: list instructor accounts"},
    {"method": "POST", "path": "/admin/instructors", "description": "Admin: approve/add a new instructor"},
    {"method": "DELETE", "path": "/admin/instructors/:id", "description": "Admin: remove an instructor"},
    {"method": "GET", "path": "/admin/stats", "description": "Admin: view platform-wide statistics"},
    {"method": "POST", "path": "/superadmin/admins", "description": "SuperAdmin: create new admin account"},
    {"method": "PUT", "path": "/superadmin/subscriptions/:id/cancel", "description": "SuperAdmin: cancel a user subscription"},
    {"method": "GET", "path": "/superadmin/payments", "description": "SuperAdmin: view all payment transactions"}
  ],
  "payment_methods": ["credit_card", "check"]
}
```

**Sources:** We based this design on common e-learning platforms. For example, Udemy provides multimedia lectures, quizzes and Q&A, and an instructor dashboard with course-level stats. The payment system integrates credit-card gateways (as Udemy does with Visa/MC/AmEx) and can offer offline methods (Udemy even allows cash/bank transfers in some regions). All features and flows above follow these industry patterns, adapted into a NestJS/MySQL architecture.