# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite project with Tailwind CSS v4. The application is located in the `react-app/` directory.

## Development Commands

All commands should be run from the `react-app/` directory:

```bash
# Start development server (runs on port 2500)
npm run dev

# Build for production (compiles TypeScript first, then builds with Vite)
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Tech Stack

- **Build Tool**: Vite 7.x with Fast Refresh (HMR)
- **Framework**: React 19.x with TypeScript
- **Styling**: Tailwind CSS v4 (configured via Vite plugin)
- **Linting**: ESLint 9.x with TypeScript ESLint, React Hooks, and React Refresh plugins
- **TypeScript**: Project references architecture (see tsconfig.json)

## Configuration Files

- **vite.config.ts**: Vite configuration with React and Tailwind plugins, dev server set to port 2500
- **eslint.config.js**: Flat config format with TypeScript, React Hooks, and React Refresh rules
- **tsconfig.json**: Uses project references to split app code (tsconfig.app.json) and build tooling (tsconfig.node.json)

## Development Notes

- The dev server uses port 2500 with `strictPort: false` (falls back to next available port if occupied)
- ESLint uses the modern flat config format with `defineConfig` and `globalIgnores`
- React Compiler is not enabled due to performance considerations
- Build process runs TypeScript compilation (`tsc -b`) before Vite build
