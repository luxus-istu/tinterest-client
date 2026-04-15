# Agent Optimization

## 🪙 Token Efficiency
- Use **imperative, concise language** in all responses.
- **Skip pleasantries** and redundant context markers.
- **Batch Edits**: Group multiple small edits into a single `multi_replace_file_content` call.
- **Targeted Reading**: Use `grep_search` or `run_command` (ls, sed) to find code before using `view_file`.
- **Cache Awareness**: Don't re-read files you've already seen in the current turn unless they changed.
- **Minimal Output**: Only show relevant code snippets in thoughts; preserve the rest of the context.

## 🚀 Technical Stack
- **Framework**: Next.js 16.2 (Client-only mode).
- **Runtime**: Bun 1.x (use `bun run`, `bun add`).
- **Styles**: Tailwind CSS 4.0.
- **Core**: React 19.2, TypeScript 5.

## 🏗️ Architecture (Spring-Friendly)
- **Feature-Driven**: Organize by `/features/[feature-name]` containing components, hooks, and services.
- **Services Layer**: Centralize API calls to Spring in `/services` or `/features/api`. Use a consistent client (e.g., native `fetch` with a wrapper for auth/headers).
- **Server State**: Use **TanStack Query** (React Query) for fetching from Spring to handle caching, loading, and error states.
- **UI State**: Keep state local where possible; use **Zustand** or **Context** for global UI state only.

## 🛠️ Project Rules
- **Verify APIs**: This version of Next.js has breaking changes. **Always** check `node_modules/next/dist/docs/` before using new or complex APIs.
- **Client-Side First**: This project is **purely client-side**. Use `"use client"` directive for all interactive components.
- **Backend API**: The backend is written in **Spring**. Direct all API calls to the defined Spring endpoint.
- **Styling**: Prefer CSS variables and `@theme` blocks in CSS files over inline Tailwind for repeated patterns.
- **Imports**: Ensure absolute imports using `@/*` prefix.
- **Formatting**: Adhere to `.prettierrc`. Run `bun run lint` before finishing.
