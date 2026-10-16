# TestSprite Integration Guide

## Overview

AgentPulse uses **TestSprite 3.0** for automated end-to-end testing on every pull request. Tests are generated in the [TestSprite Web Portal](https://www.testsprite.com/dashboard) and executed automatically via the TestSprite GitHub App.

## How It Works

```
Developer opens PR → TestSprite GitHub App triggers →
Tests run against live app → Results posted as PR comment →
Developer fixes failures → Tests re-run automatically → PR goes green ✅
```

## Configuration

### TestSprite GitHub App
- **Installed on**: `naufalfx805-source/agentpulse`
- **Base Branch**: `main`
- **Environment**: Staging (`https://agentpulse-pi.vercel.app`)
- **Run on Pull Requests**: ✅ Enabled
- **Include Draft PRs**: ✅ Enabled
- **Blocking PRs**: ✅ Enabled (test failures prevent merge)

### Test Suite
- **Target URL**: `https://agentpulse-pi.vercel.app`
- **Generated via**: TestSprite 3.0 AI Exploration
- **Coverage**: Navigation, tab switching, form interactions, dashboard rendering, responsive layout, accessibility

### CI/CD Pipeline
- **GitHub Actions**: `.github/workflows/testsprite.yml` — TestSprite Continuous Verification
- **GitHub App**: TestSprite bot comments on PRs with test results
- **Vercel**: Auto-deploys `main` branch to production

## Self-Healing Loop

AgentPulse demonstrates the full TestSprite self-healing loop:

1. **Maker** (coding agent) ships code via PR
2. **Checker** (TestSprite) runs tests automatically
3. **Maker** reads failure bundle, fixes root cause
4. **Checker** re-runs tests, PR goes green

This loop is documented in [PR #1](https://github.com/naufalfx805-source/agentpulse/pull/1) (Season 4 demo) and [PR #2](https://github.com/naufalfx805-source/agentpulse/pull/2) (TestHealthMonitor feature).

## Links

- [TestSprite Portal](https://www.testsprite.com/dashboard)
- [GitHub App Docs](https://docs.testsprite.com/web-portal/integrations/github-integration)
- [Live App](https://agentpulse-pi.vercel.app)
- [TestSprite Hackathon S4](https://www.testsprite.com/hackathon-s4)
