import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseExpectedStatus,
  validateNewScenario,
  TITLE_ERROR,
  PATH_ERROR,
  STATUS_ERROR,
} from '../src/lib/scenarioValidation.mjs';

describe('parseExpectedStatus', () => {
  it('accepts whole-number codes from 100 to 599', () => {
    assert.equal(parseExpectedStatus('100'), 100);
    assert.equal(parseExpectedStatus('200'), 200);
    assert.equal(parseExpectedStatus(' 404 '), 404);
    assert.equal(parseExpectedStatus('599'), 599);
  });

  it('rejects codes outside 100-599, blanks and non-numeric input', () => {
    for (const raw of ['999', '600', '99', '0', '', '   ', '-200', '20.5', 'abc', undefined, null]) {
      assert.equal(parseExpectedStatus(raw), null, `expected ${JSON.stringify(raw)} to be rejected`);
    }
  });
});

describe('validateNewScenario', () => {
  const valid = { title: 'Health check', targetPath: '/api/v1/health', expectedStatus: '200' };

  it('returns trimmed values and a numeric status for valid input', () => {
    assert.deepEqual(
      validateNewScenario({ title: '  Health check ', targetPath: '  /api/v1/health  ', expectedStatus: '200' }),
      { value: { title: 'Health check', targetPath: '/api/v1/health', expectedStatus: 200 } },
    );
  });

  it('rejects an expected status of 999, 0 or empty', () => {
    for (const expectedStatus of ['999', '0', '']) {
      assert.deepEqual(validateNewScenario({ ...valid, expectedStatus }), { error: STATUS_ERROR });
    }
  });

  it('requires a title and a path that starts with a slash', () => {
    assert.deepEqual(validateNewScenario({ ...valid, title: '   ' }), { error: TITLE_ERROR });
    assert.deepEqual(validateNewScenario({ ...valid, targetPath: 'api/v1/health' }), { error: PATH_ERROR });
    assert.deepEqual(validateNewScenario({ ...valid, targetPath: '   ' }), { error: PATH_ERROR });
  });
});
