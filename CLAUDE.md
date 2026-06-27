# Project Overview
This project is a multi‑restaurant food delivery platform with:
- React Native (Expo) mobile app (TypeScript + Gluestack UI v4)
- Vite + React admin panel (TypeScript)
- Client‑side ActiveRecord‑style mock store (future Rails API)
- 3 design engines: BRUTALIST_MODERNIST, MINIMALIST_CLEAN, VIBRANT_STREET_TECH

Claude Code is configured with **ECC** and **Karpathy‑Skills**.

---

# ECC Language Rules

## TypeScript / JavaScript
- Use interfaces for complex objects; prefer `type` for unions/intersections.
- Prefer `const` over `let`; avoid `var`.
- Avoid `any` – use `unknown` or proper generics.
- Keep functions short (under 50 lines) and single‑purpose.
- Use strict null checks; handle `undefined`/`null` explicitly.

## React Native / Expo
- Use functional components with hooks.
- Keep presentational components separate from container logic.
- Use Gluestack UI’s `styled` components; avoid raw `StyleSheet`.

## Ruby on Rails (future API)
- Follow Rails conventions (CRUD, RESTful routes).
- Use strong parameters in controllers.
- Write model specs.
- Keep controllers thin; logic belongs in models/services.

## General
- No unreachable error handlers.
- Write comments for non‑obvious logic.
- Run type‑checking and linting before committing.

---

# Andrej Karpathy – Four Principles

## 1. Think Before Coding
- State assumptions explicitly.
- If ambiguous, ask for clarification; do not guess.
- List tradeoffs if more than one approach exists.

## 2. Simplicity First
- Write minimal code that solves the exact problem.
- Do not add features that were not requested.
- If a piece can be reduced from 200 lines to 50, rewrite it.

## 3. Surgical Changes
- Change only what must be changed.
- Do not “improve” adjacent code or its formatting.
- Match existing style even if you dislike it.

## 4. Goal‑Driven Execution
- Define success criteria before coding.
- Example: “Add validation” → “Write test, then make test pass.”
- Loop until all defined criteria are met.

---

# Overlap Resolution (when rules conflict)
- Specific language rules (ECC) take priority over general heuristics.
- Always follow ECC security rules above all else.
- If a Karpathy principle contradicts a language rule, the **language rule wins**.

---

# Project‑Specific Overrides
- Always use Gluestack UI v4 components and theme tokens.
- All screens must follow the module order specified in the architecture plan.
- Back‑button and header rules (overlay vs. solid, no‑back on success) are mandatory.