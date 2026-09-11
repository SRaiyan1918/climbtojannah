# Climb to Jannah — Rebuild Design Spec

Date: 2026-09-11
Status: Approved design, pending implementation plan
Branch: `upgrade/react-rebuild`

## 1. Product Goal

Rebuild Climb to Jannah from a prototype-style static website into a polished, scalable Muslim productivity PWA focused on sincere self-improvement, disciplined routines, and private reflection.

The product must preserve the existing mission and recognizable identity while replacing weak architecture, unsafe patterns, duplicated code, and unclear scoring semantics.

## 2. Product Positioning

- Public Muslim productivity app.
- Personal data private by default.
- Optional sharing can be added later, always opt-in.
- Architecture should be ready for future community/challenge features without implementing unnecessary social complexity in v1.
- Brand name remains **Climb to Jannah**.
- Primary tagline: **“Grow with purpose. Strive with sincerity.”**

## 3. Core Ethical / Islamic Product Principles

### 3.1 No fake spiritual measurement
The app must never claim to measure Allah's reward, sin weight, Jannah distance, or spiritual rank.

Existing concepts such as arbitrary “good deed points,” negative “sin points,” or “distance to Jannah” must be replaced.

### 3.2 Consistency Score
Gamification may exist only as a productivity/self-discipline mechanic.

- Completing routines may improve a **Consistency Score**.
- The score represents adherence to user-defined routines only.
- UI copy must make this distinction clear.

### 3.3 Self-Control tracking
Habits a user wants to avoid are tracked separately from positive routines.

- No shame score.
- No arbitrary religious penalty value.
- Track clean streaks, slips, recovery, and trends.
- A slip should lead to a recovery state, not a “failure” state that makes the user feel everything is lost.

## 4. Technology Architecture

### 4.1 Frontend
- React
- TypeScript
- Vite
- React Router
- Component-based architecture
- Shared design tokens and reusable UI primitives

### 4.2 Backend / platform
- Firebase Authentication
- Cloud Firestore
- Firebase-compatible hosting/deployment flow
- PWA service worker and web manifest

### 4.3 Authentication
Support:
- Google sign-in
- Email/password registration
- Email/password login
- Password reset
- Email verification where appropriate
- Robust auth-state handling and session expiry UX

### 4.4 Internationalization
Launch English-first, but use centralized UI strings/i18n-ready structure from day one so Hindi, Urdu, and Arabic can be added later without a rewrite.

## 5. Data Strategy

### 5.1 Clean reset
No migration of legacy tracking data is required.

The rebuild may use a fresh Firestore schema optimized for the new product.

### 5.2 Privacy model
- All personal tracking data is private by default.
- Firestore rules must enforce user ownership by UID.
- Future sharing features must require explicit user action.

### 5.3 Suggested domain separation
Use small, purpose-specific collections/documents rather than one oversized user document.

Conceptual domains:
- user profile/settings
- routines/goals
- daily completions
- salah tracking
- Qur’an activity
- self-control habits
- journal entries
- weekly reflections
- notification/reminder preferences

Exact schema will be finalized in the implementation plan.

## 6. Information Architecture

Primary areas:

### Dashboard
Balanced overview rather than a dense analytics wall.

Show:
- today’s prayer status
- today’s routine progress
- Qur’an activity summary
- consistency score / streak context
- one reflection or motivation card
- quick actions
- link to deeper analytics

### Daily Routine
- Strong Islamic defaults
- User can add custom deen or dunya goals
- Add/edit/delete/reorder/hide goals
- Support recurring schedules
- Clear today state

### Salah
- Prayer times can be calculated/displayed based on user-selected location/settings
- Completion always marked manually
- Never infer that prayer was performed
- Reminders are optional

### Qur’an
Simple surface, deeper details inside.

Track:
- reading
- pages/ayah/minutes as configured
- memorization
- revision
- tafsir/study

### Self-Control
- habits to avoid
- clean streaks
- slips
- recovery tracking
- trends
- no negative spiritual scoring

### Journal
- private free-writing journal
- optional guided prompts
- weekly reflection
- helpful empty states

### Progress
Hybrid analytics + reflection.

Include:
- weekly/monthly charts
- streaks/trends
- contextual insights such as improvement/decline patterns
- short reflection summaries
- no spiritual ranking

### Settings
- profile
- auth/account controls
- reminders
- quiet hours
- privacy
- theme/accessibility preferences
- PWA/install guidance where relevant

### Help & Support
Replace placeholder actions with real support/help content and meaningful navigation.

## 7. Reminder System

Use smart, user-controlled reminders.

Requirements:
- user selects which reminders are enabled
- prayer reminders optional
- routine reminders optional
- quiet hours
- avoid notification spam
- gentle recovery prompts when a routine slips

## 8. PWA / Offline Behavior

The app should be installable as a PWA.

Offline goals:
- app shell loads offline
- recent dashboard/routine data remains usable where feasible
- writes can queue locally and sync when connectivity returns
- show clear sync/offline state
- avoid silent data loss

## 9. Visual Design System

Direction: premium cinematic spiritual + calm minimalism.

### Palette
- deep emerald
- charcoal
- warm cream
- restrained gold accents

### Visual language
- subtle Islamic geometric details
- refined gradients
- soft depth rather than heavy glassmorphism
- calm spacing
- strong readability
- premium rather than childish gamification

### Motion
- subtle page transitions
- gentle completion feedback
- restrained streak/progress animation
- reduced-motion support

### Responsive strategy
- mobile-first
- compact mobile navigation
- refined desktop sidebar/topbar
- tablet layouts intentionally handled, not accidental scaling

## 10. Accessibility

Must include:
- semantic HTML
- keyboard navigation
- visible focus states
- sufficient contrast
- accessible form labels/errors
- reduced-motion support
- screen-reader-friendly interactive controls

## 11. Security

Required:
- UID-scoped Firestore rules
- safe rendering of all user content
- no direct unsafe `innerHTML` patterns
- validation for user input
- authorization enforced server-side through Firestore rules, not only UI checks
- no secrets committed that should be private

Firebase client config may remain client-visible as intended by Firebase, while actual protection depends on Auth and security rules.

## 12. Reliability / Error States

Every major flow must account for:
- loading
- empty
- offline
- sync pending
- sync failure
- auth expired
- permissions denied
- network failure
- invalid form input

User-facing errors must be understandable and actionable.

## 13. Performance

Replace wasteful polling and duplicated logic.

Goals:
- no unnecessary fixed-interval Firestore refetch loops
- lazy-load noncritical routes where useful
- cache efficiently
- keep bundle size reasonable
- avoid repeated Firebase initialization
- use subscriptions only where real-time behavior is valuable

## 14. Testing / Quality Gates

Before merge to `main`:
- TypeScript type-check passes
- lint passes
- production build passes
- unit tests pass
- core integration flows verified
- responsive behavior checked

Priority tests:
- consistency/streak/date calculations
- goal completion behavior
- auth flow
- offline/write recovery behavior
- routing/navigation

GitHub Actions should run at least build, lint, type-check, and tests.

## 15. Deployment

- Preserve `main` until rebuild is verified.
- Develop on `upgrade/react-rebuild`.
- Clean legacy pathing issues such as root-relative links that break under project hosting.
- Review/remove/fix legacy CNAME configuration as part of deployment work.
- Final hosting target should support SPA routing and PWA requirements reliably.

## 16. Legacy Replacement Scope

The rebuild replaces the current giant standalone HTML-page structure and repeated inline CSS/JS with a modular application.

Legacy concepts to remove or reinterpret:
- “distance to Jannah”
- arbitrary spiritual point values
- negative sin points
- duplicated per-page Firebase initialization
- duplicated navigation/auth UI
- placeholder support actions
- repeated raw DOM construction patterns
- fixed polling where event/subscription-driven logic is better

Useful existing concepts to preserve in improved form:
- daily goals
- deed/routine tracking
- progress views
- journal/reflection
- motivation content
- auth-backed personal data

## 17. V1 Success Criteria

The rebuild is successful when:

1. A new user can create/sign into an account reliably.
2. A user can configure a personal routine using Islamic defaults plus custom deen/dunya goals.
3. A user can manually track salah and Qur’an activity.
4. A user can track habits to avoid without shame-based scoring.
5. A user can journal privately and complete weekly reflections.
6. Dashboard gives a calm, useful summary without overwhelming the user.
7. Progress views combine useful metrics with contextual reflection.
8. App works well on common mobile widths and feels intentionally designed on desktop.
9. PWA install/offline behavior works without silent data loss.
10. Firestore rules prevent users from reading or modifying another user’s private data.
11. CI quality gates pass before merge.
12. The product feels premium, coherent, and significantly more trustworthy than the legacy prototype.

## 18. Explicit Non-Goals for V1

Do not add yet:
- public leaderboards
- competitive spiritual rankings
- public default activity feeds
- chat/community forums
- paid subscriptions
- complex admin dashboards
- AI religious rulings or automated fatwa-style advice

These can be considered later only if they serve the product without compromising privacy or purpose.
