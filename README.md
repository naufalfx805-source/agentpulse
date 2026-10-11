# ⚡ AgentPulse — Autonomous AI Agent Verification & Self-Healing Ops

[![TestSprite 3.0 Verified](https://img.shields.io/badge/TestSprite%203.0-Verified-10b981.svg)](https://testsprite.com)
[![Live Demo](https://img.shields.io/badge/Demo-agentpulse--pi.vercel.app-blueviolet.svg)](https://agentpulse-pi.vercel.app)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16%20App%20Router-black.svg)](https://nextjs.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com)

> Built for **TestSprite Hackathon Season 4** (Project Track & Continuous Verification Showcase).  
> **Live Production**: [https://agentpulse-pi.vercel.app](https://agentpulse-pi.vercel.app)  
> **Author**: Naufal ([@naufalfx805-source](https://github.com/naufalfx805-source)) • **Discord**: `@npall_805` • **Contact**: `naufalfx805@gmail.com`

---

## 🌟 Overview

**AgentPulse** is a mission-control observability and autonomous verification platform designed for developers building with modern AI agents (Antigravity, Claude Code, Codex, Cursor).

As AI agents write and deploy code in production, traditional manual QA is a bottleneck. AgentPulse pairs continuous telemetry with **TestSprite 3.0** autonomous testing to establish **"The Self-Healing Loop"**: every pull request is tested headless by TestSprite; when a regression is caught, a structured failure bundle is fed directly to the coding agent to fix the root cause, re-run, and pass green automatically.

---

## 🚀 Key Features

### 1. Fleet Reliability Observability
- Real-time Fleet Success Rate (98.6%), Mean Time to Remediation (MTTR: 42s), and Flakiness Index tracking.
- Live event stream showing agent dispatches, assertion checks, and automated self-healing events.

### 2. Multi-Step Pipeline Studio
- Interactive visual DAG for agent verification workflows (Prompt synthesis &rarr; Headed E2E test &rarr; AST diff check &rarr; Telemetry emission).
- Hard guardrails: Token allocation budget boundaries and timeout bounds matching TestSprite CLI standards.

### 3. TestSprite 3.0 Scenario Repository
- Comprehensive test scenario catalog (E2E, API contracts, Security guards, Regressions).
- Interactive scenario creator with real-time client-side schema validation.

### 4. Chaos & Synthetic Webhook Simulator
- Simulate GitHub Actions / TestSprite webhook events (`pull_request`, `deployment`, `testsprite_check`).
- Chaos injection knobs: Artificial latency (+0 to 2500ms), simulated 429 rate limits, and flaky network drops.

### 5. The TestSprite Self-Healing Loop Inspector
- Interactive walkthrough of the official 4-step Hackathon Season 4 loop:
  1. **Write (Maker)**: Agent pushes initial feature commit.
  2. **Test (Checker)**: TestSprite check fires on PR and catches regression.
  3. **Fix (Maker)**: Agent ingests failure bundle & commits root cause patch.
  4. **Test Again (Checker)**: TestSprite automatically reruns & PR turns GREEN!

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 16.4 (App Router, Turbopack)
- **Language**: TypeScript (Strict typing)
- **Styling**: Tailwind CSS v4 + Custom Cybernetic Dark Glassmorphism
- **Icons**: Lucide React
- **Automated Verification**: TestSprite 3.0 Portal + GitHub Actions Action (`TestSprite/testsprite-action@v1`)

---

## 🏃 Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/naufalfx805-source/agentpulse.git
cd agentpulse

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

---

## 🔄 TestSprite 3.0 Integration

AgentPulse is verified on every PR using the official GitHub Actions workflow:

```yaml
name: TestSprite Continuous Verification
on: [pull_request, push]

jobs:
  testsprite-verification:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run TestSprite Headless Verification
        uses: TestSprite/testsprite-action@v1
        with:
          api-key: ${{ secrets.TESTSPRITE_API_KEY }}
          project-id: ${{ secrets.TESTSPRITE_PROJECT_ID }}
          fail-on-skipped: true
```

---

## 📜 License

Licensed under the [Apache License, Version 2.0](LICENSE).
