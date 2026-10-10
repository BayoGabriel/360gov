# Frontend Architecture and AI Engineering Rules

**Project type:** Large, modular dashboard platform for government
ministries, departments, and agencies (MDAs)\
**Frontend baseline:** Vite + React + TypeScript\
**Status:** Foundational architecture; extend it deliberately as product
requirements become clear.

## 1. Purpose

This document is the source of truth for how AI coding agents and human
developers must design, implement, test, and maintain the frontend. The
application must remain modular as agencies, departments, roles,
workflows, records, and reporting needs grow.

The architecture must prioritize:

-   Clear boundaries between UI, state, domain logic, and API access.
-   Feature-based organization rather than one enormous global component
    directory.
-   Small components that are easy to review, test, and reuse.
-   Strong typing and explicit API contracts.
-   Secure, permission-aware navigation and actions.
-   Accessible, responsive, performant interfaces.
-   Auditable, predictable behavior suitable for government operations.
-   Reusable platform capabilities without prematurely abstracting
    unrelated features.

**Default assumption:** use React with Vite and TypeScript. Do not
introduce a backend, database, authentication vendor, UI library, or
state library until the project requirements or existing repository
establish the choice.

## 2. Non-negotiable AI coding rules

Every AI agent working in this repository must follow these rules.

### 2.1 Component size

1.  **No React component may exceed 100 lines of source code.** Target
    30--70 lines for ordinary components.
2.  Count the component's implementation, including its JSX, local
    declarations, and component-specific handlers. Imports and blank
    lines do not justify splitting a component artificially.
3.  If a component approaches 80 lines, look for a meaningful extraction
    before adding more behavior.
4.  Split by responsibility: page sections, toolbar, filters, table,
    table row, empty state, dialog, form section, and summary panel are
    possible boundaries.
5.  Do not split a component into arbitrary fragments just to satisfy
    the line limit. Each extracted component must have a clear name,
    purpose, and interface.
6.  If a file contains multiple React components, each component must
    stay under 100 lines. Prefer one primary component per file.
7.  Keep custom hooks, schemas, types, constants, API calls, and
    formatters in separate files where this improves clarity. These
    files should also remain focused and reasonably small.
8.  When a file must exceed 100 lines for a legitimate non-component
    reason (for example, generated code or a large static data
    definition), explain why in the pull request or implementation
    summary. Never put generated code into hand-maintained UI files.

### 2.2 Separate state and UI

-   Presentational components render props and emit callbacks. They
    should not own API requests, authorization decisions, or complex
    business workflows.
-   Put screen-level orchestration in a page-specific hook, such as
    `useStaffDirectoryPage`.
-   Put reusable feature behavior in feature hooks, such as
    `useStaffFilters` or `useApprovalActions`.
-   Put server state and caching in the query layer, not in ad hoc
    `useEffect` calls scattered through components.
-   Keep local UI state local when it is truly ephemeral: open menu,
    expanded panel, or current input text.
-   Keep URL state in route search parameters when it should be
    bookmarkable or shareable, such as pagination, filters, selected
    tab, and sort order.
-   Keep form state in the form layer.
-   Keep shared client state minimal. Do not create a global store for
    data that belongs in a query cache, URL, or local component.
-   Do not place hooks or state in presentational components unless the
    state is strictly visual and local.
-   Never mix network calls, data transformation, permission policy, and
    complex JSX in one component.

### 2.3 TypeScript

-   Use strict TypeScript. Do not use `any` to silence errors.
-   Prefer `unknown` at untrusted boundaries and narrow it with
    validation.
-   Avoid type assertions (`as`) unless the assertion is justified and
    safe.
-   Define API request/response types and domain types explicitly. Do
    not reuse a form input type as a database/API type when their
    responsibilities differ.
-   Use discriminated unions for states with mutually exclusive
    variants.
-   Model loading, success, empty, and error states explicitly.
-   Avoid enums where literal unions provide a simpler contract.
-   Do not use non-null assertions (`!`) to bypass uncertainty.
-   Export types intentionally; avoid giant shared type files that
    couple unrelated features.

### 2.4 Implementation discipline

-   Inspect the repository and existing conventions before changing
    files.
-   Read this document and relevant feature code before implementing a
    task.
-   Implement only requested, understood behavior. Do not invent
    endpoints, payload fields, permissions, workflows, or business
    rules.
-   If an API contract is missing, define the assumption explicitly and
    isolate it behind a typed adapter; ask for clarification when the
    assumption affects correctness or security.
-   Reuse established design-system and feature components where
    appropriate.
-   Do not duplicate logic to meet a deadline. Extract shared logic only
    when there is a real repeated need or a clear domain concept.
-   No dead code, unused imports, abandoned components, commented-out
    implementations, placeholder success states, or fake production
    data.
-   Do not silently swallow errors. Provide useful user feedback and
    safe logging.
-   Do not log access tokens, session secrets, sensitive personal data,
    or confidential government records.
-   Do not claim a task is complete until relevant checks have run.
    Report checks that could not be run.

## 3. Recommended technology boundaries

Use the following as a default baseline, not permission to install every
dependency at once.

  -----------------------------------------------------------------------
  Concern                 Default approach        Rule
  ----------------------- ----------------------- -----------------------
  Build and development   Vite + TypeScript       Keep configuration
                                                  minimal and documented.

  UI                      React                   Functional components;
                                                  no class components.

  Routing                 TanStack Router or      Choose one, configure
                          React Router            typed routes and
                                                  route-level access
                                                  handling; do not mix
                                                  routers.

  Server state            TanStack Query          Centralize cache
                                                  policy, invalidation,
                                                  retries, and request
                                                  lifecycle.

  Forms                   React Hook Form + Zod   Validate client input
                                                  and server responses
                                                  where appropriate;
                                                  server remains
                                                  authoritative.

  Tables                  TanStack Table when     Keep column
                          advanced tables are     definitions, filtering,
                          needed                  and table state outside
                                                  large render
                                                  components.

  Client state            Start with React        Do not duplicate server
                          state/context; add      state.
                          Zustand only for        
                          demonstrated            
                          cross-feature client    
                          state                   

  HTTP                    A small typed fetch     Centralize base URL,
                          client or the           headers, error
                          repository's            normalization, and
                          established client      cancellation.

  Styling                 Existing design system; No competing styling
                          otherwise CSS Modules   systems without a
                          or a clearly defined    documented reason.
                          utility strategy        

  Testing                 Vitest, React Testing   Test behavior and
                          Library, and suitable   permissions, not
                          browser-level tests     implementation details.

  Icons                   One consistent icon     Do not mix icon
                          package or existing     libraries casually.
                          icon system             
  -----------------------------------------------------------------------

Dependency versions must be selected and pinned according to the
repository's supported versions. Do not install or upgrade packages
without checking compatibility.

## 4. Architectural layers

The dependency direction should point inward toward domain concepts. UI
layers may call hooks; hooks may call feature services and query
definitions; services may use the shared API client. Lower-level API and
domain modules must not import page components.

1.  **Application shell:** bootstrap, providers, route tree, global
    error boundary, session lifecycle.
2.  **Routes and screens:** page composition, route parameters, URL
    state, page-specific orchestration.
3.  **Feature components:** domain-specific UI such as staff tables,
    approval queues, budget summaries, and document panels.
4.  **Feature hooks:** state orchestration, user actions, derived view
    models, and coordination of queries/mutations.
5.  **Feature services and query definitions:** API operations, query
    keys, mutations, invalidation, and domain-specific transformations.
6.  **Shared platform:** design system, API client, access-control
    utilities, formatting, reusable table/form patterns, and common
    types.
7.  **Backend:** source of truth for authentication, authorization,
    validation, workflow transitions, and persisted data.

Do not import UI components into services. Do not import one feature's
internal files directly from another feature. If features need to
communicate, use a public feature API, shared domain contract, or
explicit application-level composition.

## 5. Suggested project structure

Use a feature-first structure. Adapt names to actual product modules,
but preserve the boundaries.

``` text
src/
├── app/
│   ├── App.tsx
│   ├── main.tsx
│   ├── router/
│   │   ├── router.tsx
│   │   ├── route-guards.ts
│   │   └── route-meta.ts
│   ├── providers/
│   │   ├── AppProviders.tsx
│   │   ├── QueryProvider.tsx
│   │   └── AuthProvider.tsx
│   ├── layouts/
│   │   ├── AuthLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardTopbar.tsx
│   │   └── Breadcrumbs.tsx
│   └── errors/
│       ├── AppErrorBoundary.tsx
│       └── RouteErrorPage.tsx
├── routes/                       # Route entry points and page composition
│   ├── dashboard/
│   │   ├── DashboardRoute.tsx
│   │   └── index.ts
│   ├── staff/
│   │   ├── StaffRoute.tsx
│   │   └── index.ts
│   └── approvals/
│       ├── ApprovalsRoute.tsx
│       └── index.ts
├── features/
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── queries/
│   │   ├── types/
│   │   └── index.ts
│   ├── staff/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── queries/
│   │   ├── schemas/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── approvals/
│   ├── documents/
│   ├── departments/
│   ├── budgets/
│   ├── procurement/
│   ├── reports/
│   ├── notifications/
│   └── audit/
├── shared/
│   ├── api/
│   │   ├── api-client.ts
│   │   ├── api-error.ts
│   │   └── api-types.ts
│   ├── auth/
│   │   ├── permissions.ts
│   │   └── access.ts
│   ├── components/
│   │   ├── Button/
│   │   ├── DataTable/
│   │   ├── FormField/
│   │   ├── Modal/
│   │   ├── PageHeader/
│   │   ├── Pagination/
│   │   ├── SearchInput/
│   │   ├── StatusBadge/
│   │   ├── EmptyState/
│   │   ├── ErrorState/
│   │   └── LoadingState/
│   ├── hooks/
│   ├── lib/
│   ├── config/
│   ├── constants/
│   ├── types/
│   ├── utils/
│   └── styles/
├── assets/
└── test/
    ├── setup.ts
    ├── fixtures/
    └── helpers/
```

**Structure rules**

-   A feature owns its components, hooks, services, query keys, schemas,
    types, and tests where practical.
-   `shared/` contains genuinely generic building blocks, not every
    component that is used twice.
-   `routes/` should remain thin: route parameters and guards in,
    feature page composition out.
-   Do not create a directory or abstraction until it has a real
    purpose.
-   Each feature's `index.ts` exposes only the public surface other
    modules are allowed to consume.
-   Avoid barrel exports that create circular dependencies or hide
    dependency direction.
-   Keep tests close to the code (`StaffTable.test.tsx`) or in a
    consistent feature test directory.

## 6. Every screen must be decomposed before implementation

Before coding a screen, the AI agent must produce a short screen plan in
the task response or implementation notes. Identify:

1.  Route and required permissions.
2.  Data sources and API operations.
3.  URL state (filters, search, sort, pagination, tabs).
4.  Page-level state and actions.
5.  Component tree, with each component's single responsibility.
6.  Loading, empty, error, partial-data, and success states.
7.  Responsive behavior and accessibility considerations.
8.  Tests for the key behavior and permission boundaries.

A screen should normally be composed from a page component, a
page-specific hook, and small visual components. Do not force every
screen into an identical template when the domain differs.

### Example: Staff directory screen

``` text
StaffRoute
└── StaffDirectoryPage
    ├── PageHeader
    │   ├── Breadcrumbs
    │   └── StaffActions
    ├── StaffSummary
    │   └── SummaryMetric
    ├── StaffDirectoryPanel
    │   ├── StaffToolbar
    │   │   ├── StaffSearch
    │   │   ├── StaffStatusFilter
    │   │   └── StaffDepartmentFilter
    │   ├── StaffTable
    │   │   ├── StaffTableHeader
    │   │   ├── StaffTableRow
    │   │   └── StaffRowActions
    │   ├── StaffPagination
    │   ├── StaffEmptyState
    │   └── StaffErrorState
    ├── StaffDetailsDrawer
    ├── CreateStaffDialog
    │   └── StaffForm
    │       ├── StaffIdentityFields
    │       ├── StaffEmploymentFields
    │       └── StaffRoleFields
    └── ConfirmStaffActionDialog
```

The tree is illustrative. Only create components that support a distinct
responsibility, reuse, or test boundary.

### Example screen file layout

``` text
features/staff/
├── components/
│   ├── StaffDirectoryPage.tsx
│   ├── StaffSummary.tsx
│   ├── StaffDirectoryPanel.tsx
│   ├── StaffToolbar.tsx
│   ├── StaffTable.tsx
│   ├── StaffTableRow.tsx
│   ├── StaffRowActions.tsx
│   ├── StaffDetailsDrawer.tsx
│   ├── StaffForm.tsx
│   └── StaffEmptyState.tsx
├── hooks/
│   ├── useStaffDirectoryPage.ts
│   ├── useStaffFilters.ts
│   └── useStaffActions.ts
├── queries/
│   ├── staff.keys.ts
│   ├── staff.queries.ts
│   └── staff.mutations.ts
├── services/
│   └── staff.api.ts
├── schemas/
│   └── staff.schema.ts
├── types/
│   └── staff.types.ts
└── utils/
    └── staff-formatters.ts
```

## 7. State management policy

Classify state before implementing it.

  -----------------------------------------------------------------------
  State category          Where it belongs        Examples
  ----------------------- ----------------------- -----------------------
  Server state            Query/cache layer       Staff records,
                                                  approvals, budgets,
                                                  documents

  URL state               Route search parameters Search, filters,
                                                  sorting, page number,
                                                  selected tab

  Form state              Form library and schema Create/edit staff,
                                                  submit an approval

  Local UI state          Component or page hook  Dialog open, drawer
                                                  open, expanded row

  Cross-feature client    Small global store only A temporary multi-step
  state                   when justified          workspace selection

  Session and identity    Auth/session layer      Current user, active
                                                  agency, session status

  Derived state           Compute from existing   Filtered counts, button
                          state                   availability, display
                                                  labels
  -----------------------------------------------------------------------

Rules:

-   Do not copy server data into Zustand or React Context just to make
    it globally accessible.
-   Do not duplicate URL state in a global store.
-   Do not store values that can be derived cheaply; calculate them from
    source state.
-   Avoid `useEffect` for derived values and for routine query fetching.
-   Use query keys that include all parameters affecting the response.
-   Cancel or ignore stale requests when the underlying library does not
    already handle it.
-   Reset dependent filters when parent filters change.
-   Make filter and pagination behavior consistent across list screens.
-   Treat mutation success as confirmed only after the API responds
    successfully.
-   Invalidate or update affected queries after mutations.
-   Make destructive actions explicit, permission-checked, and
    confirmable.

## 8. API and data-access rules

-   All network access must pass through the shared API client.
-   Feature services define endpoint-specific operations; UI components
    never call `fetch` directly.
-   Keep base URL and environment configuration centralized. Never
    hard-code production URLs in feature code.
-   Normalize errors into a typed shape suitable for UI handling.
-   Support request cancellation where applicable.
-   Define pagination, filtering, sorting, and error contracts
    consistently.
-   Validate important untrusted response data at runtime when the API
    contract or data source warrants it.
-   Do not assume that hiding a UI action enforces authorization; the
    backend must enforce every protected operation.
-   Do not fabricate API responses or use mock data as if it were
    production data.
-   Keep mock fixtures in tests or explicitly marked development-only
    modules.
-   Do not make multiple requests for the same data from different
    components when a shared query can serve them.

Suggested response handling states:

``` ts
type AsyncViewState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "success"; data: T };
```

Use this shape only when it fits the view. Query libraries may already
model these states and should not be wrapped unnecessarily.

## 9. Government platform concerns

The platform may be deployed to multiple agencies with different
organizational structures, modules, permissions, and workflows. Design
for that variability without hard-coding assumptions about any one
agency.

### 9.1 Agency and organization context

-   Represent the active agency/tenant explicitly in the session or
    application context according to the backend contract.
-   Scope queries and cache keys by tenant/agency wherever data can
    differ by tenant.
-   On agency switching, clear or invalidate tenant-scoped cached data
    and reset selections that are no longer valid.
-   Never rely on a client-provided tenant ID as proof of access. The
    backend must verify tenant membership and scope every request.
-   Do not bake an agency's name, logo, departments, workflow steps, or
    module availability into reusable platform components. Use
    configuration from an authorized source.

### 9.2 Authentication and authorization

-   Treat authentication state as asynchronous: unknown/loading,
    authenticated, unauthenticated, and expired/error where appropriate.
-   Protect routes and actions based on explicit permission
    capabilities, not display names or role labels alone.
-   Use centralized helpers such as `can("staff.create")`; avoid
    scattering role string comparisons throughout JSX.
-   UI permission checks improve usability but are not a security
    boundary.
-   Default to denying access when permissions are missing or cannot be
    established.
-   Do not store secrets or sensitive tokens in local storage unless the
    chosen security design explicitly requires and documents it.
-   Follow the backend's session/token model; do not invent one in the
    frontend.
-   Provide safe handling for session expiry and unauthorized responses
    without infinite redirect loops.

### 9.3 Audit, records, and workflows

-   Present audit history as read-only records unless an explicitly
    authorized operation allows otherwise.
-   Show clear status, actor, timestamp, and available provenance for
    important workflow actions when supplied by the API.
-   Treat approval and procurement transitions as server-owned state
    machines. The frontend may display allowed actions but must not
    invent transitions.
-   Require confirmation for destructive, irreversible, or high-impact
    actions.
-   Prevent accidental duplicate submissions and display the result of
    each operation.
-   Do not silently overwrite unsaved user edits.
-   Avoid placing sensitive government records in browser logs,
    analytics events, URLs, or error messages.
-   Use neutral, precise language for statuses and errors; do not imply
    legal or procedural meaning not established by product requirements.

### 9.4 Accessibility and usability

-   Support keyboard navigation, visible focus, semantic HTML,
    accessible names, and dialog focus management.
-   Do not use color as the only way to communicate status or risk.
-   Provide labels and instructions for form fields and expose
    validation errors to assistive technology.
-   Tables must have meaningful headers and a clear mobile strategy.
-   Handle long names, reference numbers, and multilingual text without
    breaking layouts.
-   Keep loading, empty, error, and no-permission states distinct.
-   Confirm any localization, date, timezone, currency, and
    number-formatting requirements before hard-coding conventions.

## 10. Design system and styling

-   Establish centralized design tokens for colors, typography, spacing,
    radii, borders, focus rings, and z-index layers.
-   Do not hard-code arbitrary colors or spacing values throughout
    feature components.
-   Reuse semantic components for buttons, inputs, tables, badges,
    alerts, dialogs, page headers, and feedback states.
-   Separate visual variants from business logic.
-   Avoid one-off styling that conflicts with existing tokens.
-   Prefer CSS variables and the repository's established styling
    method.
-   Use semantic HTML first; add ARIA only when native semantics are
    insufficient.
-   Build responsive layouts intentionally for wide desktop dashboards,
    laptops, tablets, and narrow screens.
-   Do not use charts for decoration. Every chart must answer a real
    operational question and provide accessible labels or a data
    alternative.
-   Keep high-density data readable; use pagination or virtualization
    for genuinely large lists rather than rendering thousands of rows at
    once.

## 11. Routing and navigation

-   Define routes centrally or through the selected router's
    file-based/conventional structure.
-   Keep route definitions and navigation metadata separate from page
    content.
-   Apply authentication and permission guards consistently.
-   Use nested layouts for authenticated dashboard areas and distinct
    layouts for sign-in or other public flows.
-   Make route parameters and search parameters typed and validated.
-   Preserve meaningful filters and pagination in URLs where practical.
-   Use route-level lazy loading for large feature areas when
    beneficial.
-   Provide not-found, forbidden, session-expired, and route-error
    experiences.
-   Navigation visibility is permission-aware, but direct route access
    must also be checked.

## 12. Performance and resilience

-   Avoid premature optimization, but measure before introducing
    complexity.
-   Lazy-load major route areas and heavy optional features.
-   Use stable query keys and sensible stale times based on the data's
    volatility and business needs.
-   Avoid unnecessary context providers that cause broad rerenders.
-   Memoize only when profiling or a clear identity-sensitive dependency
    justifies it.
-   Paginate server-side for large government records; do not download
    an entire registry to filter in the browser.
-   Debounce user-driven server search where appropriate, with immediate
    local feedback.
-   Provide retry behavior only for operations that are safe to retry.
    Do not automatically retry non-idempotent writes without an explicit
    safe strategy.
-   Handle partial dashboard failures so one unavailable widget does not
    necessarily blank the whole page.
-   Provide error boundaries at suitable application and route/feature
    boundaries.

## 13. Testing standards

Every feature must include tests proportionate to its risk and
complexity.

-   **Unit tests:** formatters, validation schemas, permission helpers,
    and pure domain transformations.
-   **Component tests:** rendering, interaction, loading/empty/error
    states, accessible controls.
-   **Hook/query tests:** state transitions, cache invalidation,
    mutation success/failure, and request behavior.
-   **Route tests:** authentication, permission denial, parameters, and
    navigation.
-   **Integration or end-to-end tests:** critical workflows such as
    creating a record, submitting an approval, and reviewing audit
    history.
-   **Security-sensitive tests:** users without permission cannot see
    protected actions and, more importantly, frontend behavior does not
    assume UI hiding is sufficient.
-   Prefer role- and label-based queries over brittle CSS selectors.
-   Avoid snapshots as the only evidence of correctness.
-   Use deterministic fixtures; tests must not depend on production data
    or live services unless explicitly designed as separate smoke tests.

## 14. Quality gates

Before declaring a task complete, run the checks supported by the
repository, typically:

1.  Formatting and linting.
2.  TypeScript type-check.
3.  Unit and component tests relevant to the change.
4.  Production build.
5.  Browser-level tests for critical flows when available.
6.  Manual review for permissions, responsive behavior, accessibility,
    and loading/error states.

Do not suppress lint or TypeScript errors merely to pass the build. If a
check cannot run, state which check and why.

## 15. AI implementation workflow

For each task, the AI agent must follow this sequence:

1.  **Inspect:** read this document, relevant feature files, route
    definitions, API contracts, design tokens, and tests.
2.  **Clarify:** identify missing requirements that affect security,
    data correctness, or workflow semantics. Ask instead of inventing.
3.  **Plan:** list affected files, component tree, state ownership, API
    operations, permission checks, and tests.
4.  **Implement in layers:** types/schemas and service/query definitions
    first; feature hooks next; presentational components next; page
    composition and routing last.
5.  **Keep components small:** check each React component's line count
    as it is created or changed. Split by meaningful responsibility
    before exceeding 100 lines.
6.  **Test states:** success, loading, empty, error, permission denied,
    and relevant edge cases.
7.  **Verify:** run type-check, lint, tests, and build where available.
8.  **Review the diff:** remove dead code, unrelated changes, duplicate
    logic, unsafe assumptions, and unnecessary dependencies.
9.  **Report:** summarize what changed, key architectural choices,
    checks run and results, and any unresolved assumptions.

### Required task summary format

``` text
Implemented
- ...

Architecture
- State ownership: ...
- New/reused components: ...

Verification
- Type-check: pass/fail/not run
- Tests: pass/fail/not run
- Build: pass/fail/not run

Outstanding
- API assumptions or blockers, if any
```

## 16. Definition of done for every screen

A screen is not complete until:

-   [ ] Its route and access requirements are explicit.
-   [ ] Its component tree has been planned.
-   [ ] Every React component is under 100 lines.
-   [ ] UI rendering is separated from API calls and complex state
    orchestration.
-   [ ] Server, URL, form, local UI, and global state have clear
    ownership.
-   [ ] API types and errors are handled deliberately.
-   [ ] Loading, empty, error, success, and no-access states are covered
    where applicable.
-   [ ] Permission checks are applied to navigation and actions, with
    backend enforcement assumed.
-   [ ] Keyboard accessibility and responsive behavior have been
    considered.
-   [ ] Important interactions and domain logic are tested.
-   [ ] Type-check, lint, tests, and production build pass, or failures
    are explicitly reported.
-   [ ] No dead code, unexplained `any`, fake production data, or
    unrelated changes remain.

## 17. Avoid these architectural failure modes

-   Giant page components containing the entire screen.
-   Components that fetch data, transform it, enforce permissions, and
    render all UI at once.
-   A single `components/` directory containing every feature's
    components.
-   A global store holding every API response.
-   Generic abstractions created before there is a concrete use case.
-   Cross-feature imports that bypass a feature's public API.
-   Repeated role checks and raw permission strings throughout the UI.
-   Client-only security assumptions.
-   Hard-coded agency-specific workflows in reusable platform
    components.
-   Huge tables rendered entirely in the browser.
-   `useEffect` chains used as a substitute for clear data flow.
-   Broad `try/catch` blocks that hide failures.
-   API endpoints, response fields, or workflow rules invented by the
    AI.
-   Dependency upgrades unrelated to the task.
-   Marking work complete without running available checks.

## 18. Final principle

Build a modular government operations platform, not a collection of
disconnected pages. Keep each screen understandable, each feature
responsible for its own domain, shared platform services genuinely
reusable, and security-critical rules explicit. Prefer simple, typed,
testable code over clever abstractions. When uncertain about an agency
workflow, permission, or API contract, stop and clarify rather than
guessing.
