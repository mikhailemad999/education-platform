# DESIGN.md — Education SaaS Platform

## 1. Design Direction

Build a premium, modern education SaaS platform with a **dark-first visual system**.

The visual language should feel like a combination of:
- Premium SaaS dashboard
- Modern online learning platform
- Developer/productivity application
- High-end technology brand

Primary personality:
- Dark
- Premium
- Focused
- Fast
- Professional
- Minimal but powerful
- High contrast
- Black + deep charcoal + white + controlled red accents

The interface must feel production-ready, not like a template.

Avoid:
- Excessive gradients
- Excessive glow
- Neon everywhere
- Overloaded dashboards
- Huge rounded cards
- Cartoon-like illustrations
- Low-contrast text
- Decorative UI that reduces usability

Use red as a **strategic accent**, not as the entire interface.

---

## 2. Brand Visual Identity

### 2.1 Core Colors

```text
Background / Black
#050505

Primary Surface
#0B0B0B

Secondary Surface
#111111

Elevated Surface
#171717

Border
#252525

Soft Border
#1B1B1B

Primary Text
#F5F5F5

Secondary Text
#A3A3A3

Muted Text
#737373

Primary Red
#E50914

Dark Red
#A80710

Bright Red Accent
#FF2A2A

Success
#22C55E

Warning
#F59E0B

Danger
#EF4444

Info
#3B82F6
```

### 2.2 Color Rules

- 70–80% of the interface should be black/dark neutral tones.
- 15–20% should be white/gray typography and secondary UI.
- Red should normally occupy 5–10% of visible interface emphasis.
- Use red for primary actions, active states, important indicators, prices, progress highlights, and destructive warnings when appropriate.
- Never make every button red.
- Never use bright red as a page background.
- Use white text on dark surfaces.
- Maintain strong contrast for body text and buttons.

### 2.3 Optional Premium Gradient

Use only for hero sections, featured cards, or subtle highlights:

```css
background: linear-gradient(135deg, #050505 0%, #0F0F0F 55%, #240406 100%);
```

Alternative accent:

```css
background: linear-gradient(135deg, #0B0B0B 0%, #171717 60%, #3A0508 100%);
```

Do not use gradients on every component.

---

## 3. Typography

Use a modern sans-serif font stack.

Preferred:
- Inter
- Geist
- Manrope

Fallback:

```css
font-family: Inter, Geist, Manrope, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Typography scale

```text
Display: 56–72px / 1.05
H1: 42–56px / 1.1
H2: 32–40px / 1.15
H3: 24–30px / 1.2
H4: 18–22px / 1.25
Body Large: 17–18px / 1.6
Body: 14–16px / 1.55
Small: 12–13px / 1.45
Caption: 11–12px / 1.4
```

Use bold weights carefully.

Recommended:
- 400 regular
- 500 medium
- 600 semibold
- 700 bold
- 800 only for major hero statements

Do not use heavy text everywhere.

---

## 4. Overall Layout

### Desktop

Recommended maximum content width:

```text
1440px
```

Main content horizontal padding:

```text
32px–48px
```

Dashboard layout:

```text
Sidebar: 240px–280px
Topbar: 64px–76px
Main content: flexible
```

### Tablet

Sidebar may collapse into a compact navigation rail.

### Mobile

- Sidebar becomes drawer
- Top navigation stays compact
- Tables become cards or horizontally scrollable containers
- Charts remain readable
- Form fields become full width
- Primary CTA should remain visible

---

## 5. Border Radius

Use moderate radius values.

```text
Small controls: 8px
Inputs: 10px
Cards: 14px
Large cards: 18px
Modals: 18px
Hero containers: 20px–24px
```

Avoid extreme pill-shaped layouts except:
- Tags
- Status badges
- Small filters
- Compact chips

---

## 6. Shadows and Elevation

Dark UI should use subtle depth.

Preferred shadow:

```css
box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
```

For elevated elements:

```css
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
```

Do not make every card look floating.

Use borders + subtle shadows together only when helpful.

---

## 7. Navigation

### Public Website Header

Header should be dark and slightly translucent.

Suggested structure:

```text
[Logo]
Courses
Categories
Pricing
About

[Search]

[Login]
[Get Started]
```

Behavior:
- Sticky on scroll
- Slight background blur
- Border bottom appears subtly when scrolling
- Active link uses white text + small red indicator

### Dashboard Sidebar

Sections should be visually grouped.

Example:

```text
MAIN
Overview
My Courses
Browse Courses

LEARNING
Progress
Certificates
Wishlist

ACCOUNT
Profile
Settings
Billing

ADMINISTRATION
Users
Instructors
Courses
Payments
Analytics
```

Active navigation:
- Dark elevated background
- White label
- Small red vertical indicator or red icon

Do not use giant red selected backgrounds.

---

## 8. Buttons

### Primary

Black/dark button with red emphasis or red button with dark text depending on context.

Main CTA style:

```text
Background: #E50914
Text: #FFFFFF
Radius: 10px
Height: 42–48px
```

Hover:
- Slight brightness increase
- 1–2px upward movement
- subtle red shadow

### Secondary

```text
Background: #151515
Border: #2A2A2A
Text: #F5F5F5
```

### Ghost

Transparent background with subtle hover surface.

### Danger

Red outline or dark red background for destructive actions.

### Button states

Must support:
- Default
- Hover
- Active
- Focus
- Disabled
- Loading
- Success

Loading buttons should show a compact spinner without changing width.

---

## 9. Inputs and Forms

Inputs should look clean and professional.

```text
Background: #0F0F0F
Border: #2A2A2A
Text: #F5F5F5
Placeholder: #737373
Radius: 10px
Height: 44–48px
```

Focus:
- Red border
- Subtle red glow
- Never use a thick neon outline

Error:
- Red border
- Error message directly below field

Success:
- Green indicator

Inputs should support:
- Label
- Placeholder
- Helper text
- Error state
- Required indicator

---

## 10. Cards

Default card:

```text
Background: #0F0F0F
Border: #232323
Radius: 16px
```

Hover:
- Border becomes slightly brighter
- Card moves up 2–4px
- Shadow increases subtly

Course cards should feel editorial and premium, not like generic admin cards.

Course card anatomy:

```text
[Thumbnail]
Category / Level
Course Title
Short description
Instructor
Rating + Reviews
Students
Price
CTA
```

Optional badge:

```text
BEST SELLER
NEW
FEATURED
POPULAR
```

Badges should use small typography.

---

## 11. Public Home Page

The homepage should be visually strong and conversion-oriented without looking like aggressive advertising.

### Hero Section

Composition:

```text
Small eyebrow
Large headline
Supporting paragraph
Primary CTA
Secondary CTA
Trust / metric row

Right side:
Course preview dashboard / video mockup / learning interface visual
```

Suggested headline style:

> Learn faster. Build real skills. Grow your career.

Hero background:
- Almost black
- Subtle red radial light
- Minimal abstract geometry

Do not use a large red background.

### Featured Courses

Use a 4-column grid desktop.

Responsive:
- 3 columns tablet
- 2 columns mobile landscape
- 1 column narrow mobile

### Categories

Use minimal category cards with icon + title + course count.

### Platform Statistics

Example:

```text
10K+ Learners
500+ Courses
100+ Instructors
95% Completion Satisfaction
```

Use oversized numbers and small labels.

### Instructor CTA

Dark section with subtle red accent encouraging qualified instructors to teach.

### Footer

Darkest surface.

Columns:
- Platform
- Resources
- Company
- Support
- Legal

Bottom row:
- Copyright
- Privacy
- Terms
- Cookies

---

## 12. Course Details Page

Route:

```text
/courses/:courseId
```

Visual hierarchy:

```text
Breadcrumbs
Course title
Course description
Instructor
Rating
Students count
Course image / promo video
Purchase card
Course curriculum
What you'll learn
Requirements
Resources
Instructor profile
Reviews
FAQ
```

### Purchase Card

Sticky on desktop.

Contains:
- Course thumbnail/video
- Price
- Discount price if applicable
- Buy Now
- Add to Cart
- Payment methods
- Secure checkout indicator

Use red only for the most important action.

---

## 13. Student Dashboard

Route:

```text
/dashboard
```

Top section:

```text
Good morning, {name}
Continue learning where you left off.
```

Show:
- Continue learning card
- Course progress
- Recently added courses
- Recommended courses
- Completion statistics
- Certificates

Dashboard cards should have meaningful information rather than decorative elements.

---

## 14. My Courses

Route:

```text
/my-courses
```

Tabs:

```text
All
In Progress
Completed
Saved
```

Each course card:
- Thumbnail
- Course title
- Instructor
- Progress bar
- Completion percentage
- Last lesson
- Resume button

Progress bar:
- Dark track
- Red fill

---

## 15. Course Learning Player

Route:

```text
/learn/:courseId
```

This page is one of the most important experiences in the platform.

### Layout

Desktop:

```text
Top header
----------------------------------
Main video/content area | Course curriculum
                        | Sections
                        | Lectures
----------------------------------
Lesson title
Description
Resources
Notes / Q&A / Reviews
```

Video player:
- Large
- Dark controls
- Minimal red progress indicator
- Playback speed
- Quality menu
- Fullscreen
- Captions if available

PDF lesson:
- In-browser PDF viewer
- Zoom
- Page navigation
- Download only when allowed by course settings

### Curriculum panel

Show:
- Section title
- Lecture title
- Video/PDF icon
- Duration
- Completion state
- Lock state

Current lesson:
- Red indicator
- Elevated background

Completed lesson:
- Green check

Locked lesson:
- Muted text
- Lock icon

---

## 16. Checkout

Route:

```text
/checkout
```

Use a focused, distraction-free layout.

Desktop 2-column:

```text
Payment form              Order summary
```

Payment methods:
- Credit/debit card
- Check / manual payment

Credit card form:
- Use gateway-hosted/tokenized fields where possible
- Never ask the UI to store raw card numbers or CVV

Check payment UI:
- Show payment instructions
- Show invoice/order number
- Show pending status after submission

Order summary:
- Course
- Subscription
- Discount
- Tax if configured
- Total

Primary CTA:

```text
Complete Payment
```

---

## 17. Authentication

Pages:

```text
/login
/register
/forgot-password
/reset-password
/verify-email
```

Visual design:
- Centered auth panel
- Dark background
- Small red brand mark
- Minimal distractions

Login page should optionally contain:

```text
Email
Password
Remember me
Forgot password?
Login

or

Continue with social provider
```

Do not make the authentication screen visually complicated.

---

## 18. Instructor Dashboard

Route:

```text
/instructor
/instructor/dashboard
```

The instructor dashboard should feel like a professional creator/business dashboard.

Top metrics:

```text
Total Students
Active Subscribers
Gross Revenue
Net Revenue
Published Courses
Average Rating
```

Charts:
- Revenue over time
- Enrollments over time
- Course performance

Use red to emphasize the main series and neutral grid lines.

### Instructor side navigation

```text
Overview
Courses
Create Course
Students
Revenue
Analytics
Reviews
Messages
Profile
Settings
```

---

## 19. Instructor Course Builder

Route:

```text
/instructor/courses/new
/instructor/courses/:courseId/edit
```

Use a multi-step editor.

Recommended steps:

```text
1. Basics
2. Thumbnail
3. Curriculum
4. Videos & PDFs
5. Pricing
6. SEO
7. Review
8. Publish
```

### Curriculum Builder

Use drag-and-drop sections.

Example:

```text
Section 01 — Introduction
  ├── Lecture 01 — Welcome [Video]
  ├── Lecture 02 — Setup [PDF]
  └── Lecture 03 — First Project [Video]

Section 02 — Core Concepts
  ├── Lecture 04 — Fundamentals [Video]
  └── Lecture 05 — Exercise [PDF]
```

Actions:
- Add section
- Add lecture
- Reorder
- Rename
- Duplicate
- Delete
- Publish/unpublish

---

## 20. Video Upload UI

The video uploader must feel production-ready.

States:

```text
Idle
Selecting
Uploading
Processing
Ready
Failed
Cancelled
```

Display:
- File name
- File size
- Upload progress
- Processing progress if available
- Duration
- Resolution
- Status

Business rule from product requirements:
- Video lessons may be up to 1 hour per uploaded lesson.

The UI should clearly show limits before upload.

Example helper text:

```text
Maximum duration: 60 minutes
Supported formats: MP4, WebM
```

Use a direct-to-object-storage upload architecture in implementation, while the UI displays upload progress.

---

## 21. PDF Upload UI

Support multiple PDF lesson files.

Show:
- File name
- Pages
- File size
- Upload progress
- Processing status
- Visibility/download settings

PDF cards should be compact and easy to reorder.

---

## 22. Instructor Revenue Page

Route:

```text
/instructor/revenue
```

Show:

```text
Gross Revenue
Platform Fees
Refunds
Adjustments
Net Revenue
Pending Balance
Paid Out
```

Charts:
- Revenue by month
- Revenue by course

Tables:
- Date
- Order
- Course
- Amount
- Fee
- Net
- Status

Use red for revenue highlights and green for completed payouts.

---

## 23. Instructor Analytics

Show:
- Student enrollment trends
- Course completion rate
- Watch time
- Most popular lessons
- Drop-off points
- Rating trends
- Revenue trends

Provide filters:
- Today
- 7 days
- 30 days
- 90 days
- 12 months
- Custom

Charts should be simple, readable, and not overloaded.

---

## 24. Admin Dashboard

Route:

```text
/admin
```

Admin UI should be more operational than marketing-oriented.

Top cards:

```text
Total Users
Total Instructors
Published Courses
Pending Approvals
Orders
Revenue
```

Primary sections:

```text
Users
Instructors
Courses
Categories
Orders
Reviews
Reports
Analytics
```

Admin should be able to:
- Add/remove instructors
- Approve instructors
- Suspend users
- Manage courses
- Moderate content
- View platform statistics
- Manage categories
- Review check-payment requests

Do not expose superadmin-only destructive financial controls here unless explicitly authorized.

---

## 25. SuperAdmin Dashboard

Route:

```text
/superadmin
```

The SuperAdmin interface is the most powerful control center.

Visual hierarchy:
- Serious
- Data-heavy
- Clear warnings
- Strong permission boundaries

Main sections:

```text
Overview
Users
Instructors
Admins
Courses
Subscriptions
Orders
Payments
Payouts
Financial Reports
System Settings
Audit Logs
Security
```

SuperAdmin functions:
- Create admin
- Disable admin
- Manage any user
- Manage instructors
- Manage courses
- View all financial activity
- Cancel subscriptions
- Refund orders where permitted
- Review check payments
- Configure subscription plans
- Configure platform fees
- Access audit logs

For destructive actions:
- Require confirmation modal
- Show exactly what will happen
- Require elevated confirmation for irreversible actions

---

## 26. Tables

Use modern dark tables.

Header:

```text
#111111
```

Rows:

```text
#0B0B0B
```

Hover:

```text
#161616
```

Border:

```text
#202020
```

Table requirements:
- Sticky headers for long datasets
- Search
- Filters
- Pagination
- Sort
- Empty states
- Loading skeletons
- Responsive conversion to cards when appropriate

Status badges:

```text
Published → green
Draft → gray
Pending → amber
Suspended → red
Paid → green
Failed → red
```

---

## 27. Modals and Drawers

Use modals for:
- Confirm delete
- Confirm suspension
- Confirm cancellation
- Quick edit
- Payment verification
- Create admin
- Add instructor

Modal style:
- Dark elevated surface
- 18px radius
- Subtle border
- Clear title
- Description
- Footer with action hierarchy

Avoid giant modal windows unless the form truly requires it.

---

## 28. Notifications

Toast design:

```text
Dark surface
Thin border
Small icon
Short message
Optional action
```

Types:
- Success
- Error
- Warning
- Info

Animations should be subtle.

---

## 29. Empty States

Do not show blank spaces.

Example:

```text
No courses yet
Create your first course and start teaching.
[Create Course]
```

Use small neutral illustrations or abstract iconography, not cartoon-heavy artwork.

---

## 30. Loading States

Use skeleton loading rather than spinners whenever content layout is known.

Skeleton colors:

```text
Base: #111111
Highlight: #181818
```

Animations should be soft and fast.

---

## 31. Animation System

Use motion intentionally.

### Page transitions

```text
150–250ms
Ease-out
Opacity + small vertical movement
```

### Card hover

```text
150ms
translateY(-2px)
```

### Modal

```text
180–220ms
opacity + scale(0.98 → 1)
```

### Sidebar

```text
180–240ms
```

### Progress

Smooth progress animation, but do not continuously animate static data.

Avoid:
- Excessive parallax
- Flashing UI
- Constant glowing
- Large bouncing effects

Respect:

```text
prefers-reduced-motion
```

---

## 32. Icons

Use one icon family consistently.

Recommended:
- Lucide
- Phosphor

Icon rules:
- 16px for compact controls
- 18–20px standard
- 24px dashboard cards
- Avoid mixing multiple icon styles

Use red only when the icon represents emphasis, alert, or active state.

---

## 33. Charts

Dashboard charts should follow the dark theme.

Rules:
- Dark chart background
- White/gray labels
- Red for primary series
- Gray for secondary series
- Green for positive financial completion indicators
- Minimal grid lines
- Tooltips with dark elevated surface

Recommended charts:
- Line
- Area
- Bar
- Donut for limited categorical summaries

Do not use 3D charts.

---

## 34. Course Progress Visualization

Use:
- Linear progress bars
- Circular progress only for compact summary metrics
- Completion checkmarks

Example:

```text
HTML & CSS
██████████████████░░ 84%
```

The visual should be simple and readable.

---

## 35. Subscription UI

Route:

```text
/pricing
/account/billing
```

Pricing page:

Use 2–4 pricing cards.

Selected plan:
- Red border
- Soft red glow
- White title

Do not make the entire card red.

Plan card:

```text
Plan name
Price
Billing period
Features
CTA
```

Billing page should show:
- Current plan
- Renewal date
- Payment method
- Invoice history
- Cancel subscription
- Upgrade/downgrade options where supported

---

## 36. Search UX

Search should be one of the strongest components of the platform.

Desktop header search:

```text
[ Search courses, topics, instructors... ]
```

Results should support:
- Category
- Instructor
- Level
- Price
- Rating
- Duration
- Content type
- Sort order

Search suggestions can show:
- Courses
- Categories
- Instructors

Keyboard support:

```text
Ctrl/Cmd + K
```

for global search.

---

## 37. Responsive Design

### Desktop ≥ 1200px

Full sidebar and multi-column layouts.

### Tablet 768–1199px

- Collapsible sidebar
- Reduced card columns
- Two-column dashboard where possible

### Mobile < 768px

- Sidebar drawer
- Single-column cards
- Sticky bottom CTA for important purchase flows
- Full-width form fields
- Compact dashboard cards
- Horizontal scrolling tabs where needed

### Small mobile < 480px

- Reduce page padding
- Smaller heading sizes
- Avoid dense charts
- Convert tables into cards

No horizontal page scrolling.

---

## 38. Accessibility

Required:
- Keyboard navigation
- Visible focus states
- Proper label association
- ARIA labels for icon-only buttons
- Meaningful alt text
- Sufficient text contrast
- Reduced-motion support
- Error messages tied to controls

Never communicate meaning using color alone.

Example:

Do not show only a red dot for failed payment.
Also show:

```text
Failed
```

---

## 39. Dark Mode Behavior

The platform is dark-first.

If light mode is eventually implemented, it must be an additional theme rather than changing the core identity.

Default:

```text
Dark mode
```

Do not build the first version around automatic system switching.

---

## 40. Mobile Navigation

Use a bottom navigation only for the student mobile experience if it improves access.

Suggested:

```text
Home
Explore
My Courses
Saved
Profile
```

For instructor/admin mobile:
- Prefer drawer navigation
- Do not overload bottom navigation with administrative tools

---

## 41. Pricing and Financial Visuals

Financial values must be visually clear.

Examples:

```text
$12,450.00
+$1,240 this month
-2.4% vs last month
```

Use:
- Large primary number
- Small comparison text
- Clear currency symbol
- Explicit time period

Avoid confusing red/green use without labels.

---

## 42. Security-Sensitive UI

Security actions should visually distinguish themselves.

Examples:
- Delete user
- Cancel subscription
- Refund payment
- Remove instructor
- Disable admin

Use confirmation dialogs with:
- Action title
- Consequences
- Confirm/cancel buttons
- Optional typed confirmation for destructive system-wide actions

Example:

```text
Cancel subscription?
The subscription will stop renewing according to the selected cancellation policy.
```

Do not use manipulative wording.

---

## 43. Content Management UI

Course content management should prioritize organization.

Each lecture row:

```text
[drag]
[video/pdf icon]
Lecture title
Duration / Pages
Status
More menu
```

Actions menu:

```text
Edit
Preview
Duplicate
Move
Replace file
Delete
```

---

## 44. Instructor Upload Experience

Use a clear two-stage flow:

```text
Select files
↓
Upload
↓
Process
↓
Preview
↓
Save
```

For large videos:
- Show resumable upload progress if supported
- Never freeze the whole page during upload
- Allow the instructor to continue editing metadata while processing
- Surface failures clearly

---

## 45. Student Course Player UX Rules

The player must prioritize learning.

Do not clutter the screen.

Primary controls:
- Play/pause
- Timeline
- Volume
- Speed
- Captions
- Settings
- Fullscreen

Secondary features:
- Notes
- Resources
- Discussion/Q&A

On mobile:
- Curriculum opens as a drawer
- Keep the player and lesson title highly visible

---

## 46. Design Tokens

Create reusable tokens.

```css
:root {
  --bg: #050505;
  --surface: #0B0B0B;
  --surface-2: #111111;
  --surface-3: #171717;
  --border: #252525;
  --border-soft: #1B1B1B;

  --text: #F5F5F5;
  --text-secondary: #A3A3A3;
  --text-muted: #737373;

  --red: #E50914;
  --red-dark: #A80710;
  --red-bright: #FF2A2A;

  --success: #22C55E;
  --warning: #F59E0B;
  --danger: #EF4444;
  --info: #3B82F6;

  --radius-sm: 8px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
  --radius-2xl: 24px;

  --shadow-sm: 0 4px 16px rgba(0, 0, 0, 0.18);
  --shadow-md: 0 12px 40px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.45);
}
```

---

## 47. Stitch Generation Rules

When generating UI with Stitch, always follow these instructions:

1. Use the dark theme as the default and primary visual language.
2. Use black and charcoal surfaces, not pure white pages.
3. Use red as the strategic accent color.
4. Keep layouts spacious and premium.
5. Prefer clear information hierarchy over decoration.
6. Use realistic education-platform content instead of lorem ipsum.
7. Use believable course titles, instructor names, prices, ratings, student counts, and progress values.
8. Use consistent navigation across related pages.
9. Use the same spacing, buttons, inputs, cards, badges, tables, and typography across the application.
10. Use responsive layouts from the beginning.
11. Maintain the same design language across Student, Instructor, Admin, and SuperAdmin experiences.
12. Do not create a separate visual identity for every dashboard.
13. Red should highlight actions and important states, not dominate the UI.
14. Use subtle motion only when it improves usability.
15. Avoid generic AI-dashboard styling.
16. Avoid excessive glassmorphism.
17. Avoid excessive gradients.
18. Avoid huge glowing borders.
19. Avoid giant rounded pills.
20. Keep the interface professional enough for a real commercial SaaS product.

---

## 48. Component Consistency Rules

Build reusable components for:

```text
AppShell
PublicHeader
DashboardSidebar
Topbar
CourseCard
CourseGrid
InstructorCard
StatCard
MetricCard
SearchBar
FilterBar
Tabs
Button
Input
Select
Textarea
Modal
Drawer
Toast
Badge
Avatar
DataTable
Pagination
EmptyState
Skeleton
ProgressBar
ProgressRing
ChartCard
FileUploader
VideoUploader
PdfUploader
CourseCurriculum
LectureRow
LessonPlayer
PaymentForm
OrderSummary
PricingCard
```

Each component should have consistent:
- spacing
- typography
- border treatment
- hover behavior
- focus behavior
- responsive behavior

---

## 49. Page-Level Visual Priorities

### Student pages

Priority:

```text
Discovery → Trust → Purchase → Learning → Progress
```

### Instructor pages

Priority:

```text
Create → Publish → Teach → Analyze → Earn
```

### Admin pages

Priority:

```text
Monitor → Moderate → Manage → Report
```

### SuperAdmin pages

Priority:

```text
Control → Finance → Security → Governance → Audit
```

---

## 50. Final Visual Target

The final product should feel like:

```text
Premium SaaS
+
Modern e-learning
+
Professional analytics dashboard
+
Dark black/red technology brand
```

The result should be suitable for a commercial education company and should look credible on:

- Desktop
- Laptop
- Tablet
- Mobile

The product must feel cohesive from the public homepage to the student learning player and all administrative dashboards.

### Final design principle

> **Black creates the environment. White creates clarity. Red creates action.**

Use this principle throughout the entire product.
