# ⚡ AgentPulse — TestSprite Hackathon Season 4 Official Submission Package

- **Project Name**: AgentPulse — Autonomous AI Agent Verification & Self-Healing Ops
- **Track**: Track A — Project Track (Web Application Grand Prize) & Track B CLI Contributor
- **Author**: Naufal ([@naufalfx805-source](https://github.com/naufalfx805-source))
- **Discord ID**: `@npall_805`
- **Contact Email**: `naufalfx805@gmail.com`
- **Live Production URL**: [https://agentpulse-pi.vercel.app](https://agentpulse-pi.vercel.app)
- **GitHub Repository**: [https://github.com/naufalfx805-source/agentpulse](https://github.com/naufalfx805-source/agentpulse)
- **Self-Healing Loop Demonstration PR**: [https://github.com/naufalfx805-source/agentpulse/pull/1](https://github.com/naufalfx805-source/agentpulse/pull/1)

---

## 🎯 Executive Summary

As AI agents (Antigravity, Cursor, Claude Code, Codex) increasingly generate production code at scale, traditional manual quality assurance collapses. Software cannot rely on fragile human reviews for autonomous continuous delivery.

**AgentPulse** solves this by establishing **"The Self-Healing Loop"** using **TestSprite 3.0**:
1. When an agent opens or updates a pull request, Vercel deploys a preview, and the TestSprite GitHub App runs the 37-case end-to-end suite against that preview; CI runs the build and unit tests in parallel.
2. If tests catch a bug or regression, a structured failure diagnostic payload is dispatched to the agent.
3. The agent autonomously synthesizes the fix, patches the codebase, and pushes the remediation commit.
4. Both checks rerun automatically on the new commit, and the PR goes green.

---

## 📊 How AgentPulse maps to the Season 4 judging criteria

| Criterion (weight) | Where to look |
| :--- | :--- |
| **Project quality** (40) | The live app at https://agentpulse-pi.vercel.app: fleet telemetry, the pipeline DAG studio, the scenario repository, the chaos and webhook simulator, and the self-healing loop inspector. |
| **Tests that run themselves** (40) | TestSprite portal project `agentpulse-pi` (37 E2E cases across 5 use cases), run by the TestSprite GitHub App against every pull request's own Vercel preview, with a merge gate that blocks the PR until the suite passes; plus `Build & Unit Tests` in GitHub Actions. |
| **Innovation** (20) | The app visualises and simulates the same agent-and-verifier loop that TestSprite runs on this repo's own pull requests. |

---

## 🎬 Video Demo Assets (Generated & Ready)

We recorded an automated, high-fidelity 720p HD walkthrough video capturing the live Vercel app, interactive pipeline DAG, chaos simulations, and Pull Request #1 verification:

- **Official Demo Video (CDN Direct Link)**: [Watch / Download Subtitled Demo (720p HD MP4)](https://github.com/naufalfx805-source/agentpulse/releases/download/v1.0.0/agentpulse-demo-with-subtitles.mp4)
- **GitHub Release Package**: [AgentPulse v1.0.0 Release Tag](https://github.com/naufalfx805-source/agentpulse/releases/tag/v1.0.0)
- **Local Subtitled Video**: [`videos/agentpulse-demo-with-subtitles.mp4`](file:///C:/Users/naufa/agentpulse/videos/agentpulse-demo-with-subtitles.mp4) (7.8 MB, 01:30 Duration, 720p HD, Burned-in Subtitles)
- **Local Clean Walkthrough Video**: [`videos/agentpulse-demo-walkthrough.mp4`](file:///C:/Users/naufa/agentpulse/videos/agentpulse-demo-walkthrough.mp4) (8.0 MB, 01:30 Duration, 720p HD)
- **Subtitle Track**: [`videos/agentpulse-demo-walkthrough.srt`](file:///C:/Users/naufa/agentpulse/videos/agentpulse-demo-walkthrough.srt)
- **Automated Re-recording Script**: [`scripts/record-demo-video.mjs`](file:///C:/Users/naufa/agentpulse/scripts/record-demo-video.mjs)

---

## 🎬 2-Minute Video Demo Script

### [0:00 - 0:25] The Problem & The Mission
> *"Hi everyone, I'm Naufal (@npall_805). Today, AI agents write hundreds of lines of code autonomously, but traditional CI/CD wasn't built for agentic workflows. When an agent breaks a test, human developers still have to debug it manually. That's why I built AgentPulse — an autonomous observability and self-healing mission control platform powered by TestSprite 3.0."*

### [0:25 - 0:55] Product Tour & Telemetry
> *"Here on https://agentpulse-pi.vercel.app, you can see live fleet metrics: 98.6% Fleet Success Rate, Mean Time to Remediation under 45 seconds, and real-time event telemetry. In our Pipeline Studio, developers can visually design agent verification DAGs — from prompt synthesis, to headed E2E validation, AST diff analysis, and chaos injection."*

### [0:55 - 1:35] "The Self-Healing Loop" in Action
> *"The heart of AgentPulse is the official TestSprite Self-Healing Loop. Let's look at Pull Request #1 on our repo. 
First, the Maker agent pushed a feature containing a regression in fleet reliability calculations (commit af6b8e6). 
Second, the CI unit tests caught the failure.
Third, our self-healing agent ingested the diagnostic bundle and committed the root-cause fix (commit c63fd95).
Fourth, CI reran on its own and went green, and the PR was merged. Today the TestSprite GitHub App also runs its 33-case end-to-end check on every PR."*

### [1:35 - 2:00] Conclusion & Track B Contributions
> *"To ensure seamless CLI interoperability, I also contributed upstream to TestSprite/testsprite-cli — PR #354 (structured debug logging for silent catch blocks), backed by accepted hackathon issue #186 and passing TestSprite CI. AgentPulse proves that autonomous agents and TestSprite 3.0 are the future of software engineering. Thank you!"*

---

## 💬 Discord #hackathon-s4-submissions Post

```markdown
🚀 **Submission: AgentPulse — Autonomous AI Agent Verification & Self-Healing Ops (Season 4 Project Track)**

1. **Pull Request with TestSprite Check (Required, opened in the build window)**:
https://github.com/naufalfx805-source/agentpulse/pull/5
*(TestSprite ran 37 cases against the PR's own preview, failed 4 on a real form-validation bug and held the merge; the fix commit reran the check. Earlier self-healing walkthrough: https://github.com/naufalfx805-source/agentpulse/pull/1)*

2. **Live Public URL (Required)**:
https://agentpulse-pi.vercel.app

3. **TestSprite Account (Required)**:
- **Email**: `naufalfx805@gmail.com`
- **Name / Display**: `Naufal` (`NPALL` / `@npall_805`)
- **GitHub**: `@naufalfx805-source`

4. **Demo Video Walkthrough (Optional / Encouraged)**:
https://github.com/naufalfx805-source/agentpulse/releases/download/v1.0.0/agentpulse-demo-with-subtitles.mp4
*(1:30 HD Walkthrough with burned-in subtitles covering live telemetry, DAG Studio, chaos simulator, and PR #1)*

5. **Public Repository**:
https://github.com/naufalfx805-source/agentpulse
*(Next.js 16.4 source, the CI workflow, and a README section on what the TestSprite suite covers)*
```

