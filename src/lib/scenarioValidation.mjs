/**
 * Validation for the "new test scenario" form in the Scenario Studio.
 * Plain JavaScript (with JSDoc types) so the unit tests can import it directly.
 */

export const TITLE_ERROR = 'Scenario Title is required.';
export const PATH_ERROR = 'Target Path must start with a valid relative slash (e.g. /api/v1/resource).';
export const STATUS_ERROR = 'Expected Status must be a valid HTTP status code (100–599).';

/**
 * Parse an HTTP status code typed into the form.
 * @param {unknown} raw
 * @returns {number | null} the code, or null unless it is a whole number from 100 to 599
 */
export function parseExpectedStatus(raw) {
  const text = String(raw ?? '').trim();
  if (!/^\d+$/.test(text)) return null;
  const code = Number(text);
  return code >= 100 && code <= 599 ? code : null;
}

/**
 * Validate and normalise the new-scenario form fields.
 * @param {{ title: string, targetPath: string, expectedStatus: string }} input
 * @returns {{ error: string } | { value: { title: string, targetPath: string, expectedStatus: number } }}
 */
export function validateNewScenario({ title, targetPath, expectedStatus }) {
  const cleanTitle = String(title ?? '').trim();
  if (!cleanTitle) return { error: TITLE_ERROR };

  const cleanPath = String(targetPath ?? '').trim();
  if (!cleanPath.startsWith('/')) return { error: PATH_ERROR };

  const status = parseExpectedStatus(expectedStatus);
  if (status === null) return { error: STATUS_ERROR };

  return { value: { title: cleanTitle, targetPath: cleanPath, expectedStatus: status } };
}
