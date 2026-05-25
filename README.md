# Tinterest 🎨

A high-performance, Pinterest-inspired client application built with **Next.js 16.2** and **Tailwind CSS 4.0**, powered by **Bun**. This project serves as a modern front-end for a Spring Boot backend, focusing on fluid discovery and creative expression.

---

## ✨ Features

- **Fluid Discovery**: Masonry layout for seamless image browsing.
- **Premium UI**: Built with [HeroUI v3 (Beta)](https://heroui.com) for accessible, high-quality components.
- **Smart Caching**: Integrated [TanStack Query](https://tanstack.com/query) for efficient data fetching and server-state management.
- **Dark Mode**: Native support for light/dark themes via `next-themes`.
- **Responsive Design**: Mobile-first approach using Tailwind's modern engine.

## 🚀 Technical Stack

| Category      | Technology                                                                      |
| :------------ | :------------------------------------------------------------------------------ |
| **Framework** | [Next.js 16.2](https://nextjs.org/) (Client-only mode)                          |
| **Runtime**   | [Bun 1.x](https://bun.sh/)                                                      |
| **Styling**   | [Tailwind CSS 4.0](https://tailwindcss.com/) & [HeroUI v3](https://heroui.com/) |
| **Core**      | React 19.2, TypeScript 5                                                        |
| **State**     | TanStack Query v5 & Zustand                                                     |
| **CI/CD**     | GitHub Actions & Docker                                                         |

## 🏗️ Architecture

The project adheres to a **Feature-Driven Architecture**:

- `src/features/[feature-name]`: Encapsulated logic containing components, hooks, and services.
- `src/services`: Centralized API clients for Spring Boot communication.
- `src/providers`: Global React context providers (QueryClient, HeroUI, Themes).
- **Backend Integration**: Direct API calls to a Spring Boot backend (proxied via `/api`).

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed.
- Local [Spring Boot backend](https://github.com/luxus-istu/tinterest-api) running (default: `http://localhost:8080`).

### Installation

```bash
bun install
```

### Development

```bash
bun dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
bun run build
bun start
```

## 📂 Project Structure

```text
src/
├── app/               # Next.js App Router (pages & layouts)
├── features/          # Feature-based modules (logic & components)
├── providers/         # Global context providers (Theme, Auth, Query)
├── services/          # API clients & backend communication
└── shared/            # Reusable UI components & utilities
```

### Commands Reference

| Command              | Description                              |
| :------------------- | :--------------------------------------- |
| `bun dev`            | Starts the development server            |
| `bun run build`      | Compiles the production application      |
| `bun run lint`       | Runs ESLint for code quality checks      |
| `bun run type-check` | Performs TypeScript static type checking |
| `bun start`          | Starts the production server             |

## 🐳 Docker

A multi-stage `Dockerfile` is provided for production-ready environments.

```bash
docker-compose up -d --build
```

## 🤖 CI/CD

Automated workflows via GitHub Actions:

- **Quality Gate**: Runs linting, type-checking, and build verification on every PR.
- **Auto-Deploy**: Builds and pushes multi-platform Docker images to **GitHub Container Registry (GHCR)**.

---

## 📐 Project Rules

1. **Client-Side First**: Purely client-side. Use `"use client"` for interactive components.
2. **Feature-Driven**: Logic should reside in `src/features/` whenever possible.
3. **Backend Proxy**: API calls to `/api` are routed to the Spring backend.
4. **Imports**: Use absolute paths: `import { ... } from "@/shared/..."`.

---

## 🧪 Testing

Automated end-to-end tests powered by [Playwright](https://playwright.dev/).

### Prerequisites

- Local [Spring Boot backend](https://github.com/luxus-istu/tinterest-backend) running
- Application running on `http://localhost:3000`
- Test admin accounts configured on the backend (3 accounts for parallel execution)

### Installation

```bash
bun playwright install
```

### Running Tests

| Command | Description |
| :------------------- | :--------------------------------------- |
| `bun playwright test` | Run all tests in headless mode |
| `bun playwright test --headed` | Run all tests with browser UI |
| `bun playwright test --ui` | Open interactive Playwright UI |
| `bun playwright test tests/admin/` | Run specific folder |
| `bun playwright test --workers=1` | Run sequentially (no parallelism) |

### Viewing Reports

```bash
bun playwright show-report
```

### Project Structure

```text
tests/
├── fixtures.ts          # Auth fixtures (loginAsAdmin)
├── admin/               # Admin panel tests
├── matching/            # Matching feature tests
├── profile/             # Profile editing tests
└── chatting/            # Chat feature tests
```

### Architecture

- **Auth**: Each worker logs in independently via `loginAsAdmin()` fixture to avoid token conflicts
- **Parallelism**: Workers use separate admin accounts to prevent `REFRESH_TOKEN_REUSE_DETECTED` errors

### Notes

> ⚠️ Do not import directly from `@playwright/test` — always use `../fixtures` instead
>
> ⚠️ The `auth/` folder is gitignored and should never be committed

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

<div align="center">
  Built with ❤️ by the LUXUS Team
</div>
