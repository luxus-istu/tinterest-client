# Tinterest 🎨

A premium, feature-driven Pinterest-inspired client application built with modern web technologies and a Spring Boot backend.

## 🚀 Technical Stack

- **Framework**: [Next.js 16.2](https://next.js) (Client-only mode)
- **Runtime**: [Bun](https://bun.sh/) 1.x
- **Styles**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Core**: React 19.2, TypeScript 5
- **State Management**: [TanStack Query](https://tanstack.com/query) (Server State) & [Zustand](https://zustand-demo.pmnd.rs/) (UI State)

## 🏗️ Architecture

The project follows a **Feature-Driven** architecture:
- `/features/[feature-name]`: Self-contained units with components, hooks, and services.
- **Services Layer**: Centralized Spring API communication using native `fetch`.
- **Backend**: Integrated with a Spring Boot API.

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- Local Spring Boot backend running (default: `http://localhost:8080`).

### Installation

```bash
bun install
```

### Launch Instructions

To start the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build & Deploy

To create a production build:

```bash
bun run build
```

To run the production server:

```bash
bun start
```

## 📐 Project Rules

- **Client-Side First**: Purely client-side application. Interaction layer uses `"use client"` directive.
- **API Proxy**: Frontend API calls to `/api` are automatically proxied to the Spring backend via `next.config.ts`.
- **Absolute Imports**: Use `@/*` prefix for all project imports.
- **Styling**: Prefer CSS variables and `@theme` blocks over inline Tailwind for repeated patterns.

---
