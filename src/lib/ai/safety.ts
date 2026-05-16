// ── AI safety utilities — Phase 12 ─────────────────────────────────────────
// Input sanitization, prompt injection guards, and content policy helpers.
// These run server-side before sending any content to the AI provider.

// ── Constants ──────────────────────────────────────────────────────────────────
const MAX_INPUT_LENGTH = 4000;        // Max chars for any single user-supplied field
const MAX_MESSAGE_LENGTH = 1200;      // Max chars per chat message
const MAX_MESSAGES_IN_CONTEXT = 10;  // Max conversation turns to send

// Patterns that indicate prompt injection attempts
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+previous\s+instructions?/i,
  /system\s*:\s*/i,
  /you\s+are\s+now/i,
  /forget\s+(everything|all|your)/i,
  /act\s+as\s+(a|an)\s+/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /override\s+(your|the)\s+/i,
  /reveal\s+(your|the)\s+(prompt|instructions?|system)/i,
  /anthropic|openai|claude|gpt/i,
  /api[_\s-]?key/i,
  /secret[_\s-]?key/i,
  /\bexfiltrate\b/i,
  /\bmanipulate\b/i,
];

// Unicode direction-control characters that could be abused
const DIRECTION_CONTROL_REGEX = /[‎‏‪-‮⁦-⁩]/g;

// ── sanitizeInput ──────────────────────────────────────────────────────────────
/**
 * Sanitize a single user-supplied string before including in a prompt.
 * - Trims whitespace
 * - Collapses multiple spaces
 * - Removes direction-control Unicode characters
 * - Truncates to MAX_INPUT_LENGTH
 */
export function sanitizeInput(input: string, maxLength: number = MAX_INPUT_LENGTH): string {
  return input
    .trim()
    .replace(DIRECTION_CONTROL_REGEX, "")        // strip direction-control chars
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")  // strip non-printable ASCII
    .replace(/\s+/g, " ")                        // collapse whitespace
    .slice(0, maxLength);
}

// ── sanitizeMessage ────────────────────────────────────────────────────────────
/**
 * Sanitize a user chat message. More restrictive than sanitizeInput.
 */
export function sanitizeMessage(message: string): string {
  return sanitizeInput(message, MAX_MESSAGE_LENGTH);
}

// ── containsInjectionAttempt ───────────────────────────────────────────────────
/**
 * Returns true if the input appears to contain a prompt injection attempt.
 */
export function containsInjectionAttempt(input: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

// ── guardInput ─────────────────────────────────────────────────────────────────
/**
 * Full guard for a single input field.
 * Returns { safe: true, value } or { safe: false, reason }.
 */
export function guardInput(
  input: string,
  maxLength: number = MAX_INPUT_LENGTH
): { safe: true; value: string } | { safe: false; reason: string } {
  if (!input || typeof input !== "string") {
    return { safe: false, reason: "invalid_input" };
  }
  if (containsInjectionAttempt(input)) {
    return { safe: false, reason: "injection_attempt" };
  }
  const sanitized = sanitizeInput(input, maxLength);
  if (sanitized.length === 0) {
    return { safe: false, reason: "empty_after_sanitize" };
  }
  return { safe: true, value: sanitized };
}

// ── guardMessages ──────────────────────────────────────────────────────────────
/**
 * Validate and sanitize an array of chat messages.
 * Caps at MAX_MESSAGES_IN_CONTEXT and sanitizes each message body.
 */
export function guardMessages(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): { safe: true; messages: Array<{ role: "user" | "assistant"; content: string }> } | { safe: false; reason: string } {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { safe: false, reason: "no_messages" };
  }

  const recent = messages.slice(-MAX_MESSAGES_IN_CONTEXT);

  for (const msg of recent) {
    if (!["user", "assistant"].includes(msg.role)) {
      return { safe: false, reason: "invalid_role" };
    }
    if (containsInjectionAttempt(msg.content)) {
      return { safe: false, reason: "injection_attempt" };
    }
  }

  const sanitized = recent.map((msg) => ({
    role: msg.role,
    content: sanitizeMessage(msg.content),
  }));

  return { safe: true, messages: sanitized };
}

// ── estimateTokens ─────────────────────────────────────────────────────────────
/**
 * Rough token count estimate for usage logging.
 * Arabic averages ~3 chars per token, Latin ~4 chars per token.
 * This is a placeholder — real counts come from the API response.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3);
}
