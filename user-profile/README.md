# User Profile Dashboard Module (React + TypeScript)

A polished, responsive React module that demonstrates:

- Type-safe component contracts via TypeScript interfaces
- Generic reusable UI behavior using TypeScript generics
- Dynamic data loading from real API endpoints using typed hooks
- A modern dashboard-style visual design with animated reveals

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Module Structure

- `src/modules/profile/types.ts`
  - Domain interfaces: `Profile`, `Insight`, `Activity`, `DashboardData`
  - Generic interfaces that keep module data strongly typed
- `src/modules/profile/ProfileDashboard.tsx`
  - Generic dashboard component:
    - `ProfileDashboard<TTag, TInsightMeta>`
    - Reusable generic `Collection<TItem>` renderer
- `src/modules/profile/useDashboardData.ts`
  - Typed API requests (`users`, `posts`, `todos`) from `https://dummyjson.com`
  - Maps API payloads into `DashboardData<string, InsightMeta>`
  - Exposes `data`, `isLoading`, `error`, and `refresh`
- `src/App.tsx`
  - Integrates dynamic hook data with loading, error, and retry states

## Generic Type Safety Highlights

- `Profile<TTag extends string>` constrains profile tags to known values
- `Insight<TMeta extends object>` enforces metadata shape per insight use case
- `DashboardData<TTag, TInsightMeta>` ensures consistent typing across profile, insights, and activities
- `ProfileDashboard` accepts `renderInsightMeta(meta)` with fully inferred metadata type

This makes the module flexible for other profile/dashboard screens while preserving compile-time correctness.

## Dynamic Data Flow

1. `useDashboardData(userId)` fetches user, posts, and todos in parallel.
2. API payloads are transformed into the strongly typed `DashboardData` shape.
3. `App` passes mapped data into `ProfileDashboard` and supports tag-based filtering.
4. On failures, users can retry immediately via the typed `refresh` function.
