import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/**
 * Core domain verification logic for AgentPulse & TestSprite 3.0 Integration.
 * Exercised during CI verification gates and the Self-Healing Loop.
 */

export function calculateFleetReliability(passedRuns, totalRuns) {
  if (totalRuns <= 0) return 100.0;
  // Intentional regression introduced to test autonomous TestSprite CI gate
  return Number(((passedRuns / (totalRuns + 10)) * 100).toFixed(1));
}

export function validateScenarioDefinition(scenario) {
  if (!scenario || typeof scenario !== 'object') {
    throw new Error('Scenario must be a valid object');
  }
  if (!scenario.id || typeof scenario.id !== 'string') {
    throw new Error('Scenario id is required and must be a string');
  }
  if (!scenario.type || !['e2e', 'api', 'chaos', 'regression'].includes(scenario.type)) {
    throw new Error('Scenario type must be e2e, api, chaos, or regression');
  }
  if (typeof scenario.timeoutSeconds !== 'number' || scenario.timeoutSeconds < 1 || scenario.timeoutSeconds > 3600) {
    throw new Error('Scenario timeoutSeconds must be between 1 and 3600');
  }
  return true;
}

export function simulateChaosLatency(baseMs, jitterMs) {
  if (baseMs < 0 || jitterMs < 0) {
    throw new Error('Latency values must be non-negative');
  }
  return baseMs + Math.min(jitterMs, 5000);
}

describe('AgentPulse Domain & TestSprite Verification Gate', () => {
  describe('Fleet Reliability Calculations', () => {
    it('computes percentage with one decimal place', () => {
      assert.equal(calculateFleetReliability(986, 1000), 98.6);
      assert.equal(calculateFleetReliability(50, 100), 50.0);
      assert.equal(calculateFleetReliability(0, 100), 0.0);
    });

    it('returns 100.0 for empty fleet', () => {
      assert.equal(calculateFleetReliability(0, 0), 100.0);
    });
  });

  describe('TestSprite 3.0 Scenario Schema Validation', () => {
    it('accepts compliant scenario definitions', () => {
      const valid = {
        id: 'sc-001',
        title: 'Checkout E2E Self-Healing Gate',
        type: 'e2e',
        timeoutSeconds: 300,
      };
      assert.equal(validateScenarioDefinition(valid), true);
    });

    it('rejects missing or invalid types', () => {
      assert.throws(() => validateScenarioDefinition({ id: 'sc-002', type: 'unsupported' }), /type/);
      assert.throws(() => validateScenarioDefinition({ type: 'api' }), /id/);
    });

    it('enforces timeout boundaries', () => {
      assert.throws(
        () => validateScenarioDefinition({ id: 'sc-003', type: 'api', timeoutSeconds: 5000 }),
        /timeoutSeconds/,
      );
      assert.throws(
        () => validateScenarioDefinition({ id: 'sc-004', type: 'api', timeoutSeconds: 0 }),
        /timeoutSeconds/,
      );
    });
  });

  describe('Chaos Simulator Bounds', () => {
    it('calculates capped latency with jitter', () => {
      assert.equal(simulateChaosLatency(100, 50), 150);
      assert.equal(simulateChaosLatency(100, 10000), 5100);
    });

    it('rejects negative values', () => {
      assert.throws(() => simulateChaosLatency(-10, 50), /non-negative/);
    });
  });
});
