// ── Anthropic provider — Phase 12 ────────────────────────────────────────────
// Server-side only. Never import this in client components.
// Wraps @anthropic-ai/sdk with error handling, timeouts, and safe JSON parsing.

import Anthropic from "@anthropic-ai/sdk";
import type { AIErrorCode } from "./types";

// ── Singleton client (lazy-init, server only) ──────────────────────────────────
let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new APIKeyMissingError();
  }
  _client = new Anthropic({ apiKey });
  return _client;
}

// ── Custom errors ──────────────────────────────────────────────────────────────
export class APIKeyMissingError extends Error {
  code: AIErrorCode = "missing_api_key";
  constructor() {
    super("ANTHROPIC_API_KEY is not set.");
    this.name = "APIKeyMissingError";
  }
}

export class AIProviderError extends Error {
  code: AIErrorCode;
  constructor(message: string, code: AIErrorCode = "provider_error") {
    super(message);
    this.name = "AIProviderError";
    this.code = code;
  }
}

// ── Model configuration ────────────────────────────────────────────────────────
// Read from env or fall back to a sensible default
const AI_MODEL = process.env.AI_MODEL ?? "claude-3-5-haiku-20241022";
const AI_MAX_TOKENS = 800;    // Keep responses concise and cost-effective
const AI_TIMEOUT_MS = 25000;  // 25 seconds — Next.js serverless default is 30s

// ── callAI ────────────────────────────────────────────────────────────────────
/**
 * Core function for non-streaming single-turn AI calls.
 * Returns the raw text content of the response.
 * All prompt building happens in prompts.ts.
 */
export async function callAI(params: {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}): Promise<string> {
  const client = getClient();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await client.messages.create(
      {
        model:      AI_MODEL,
        max_tokens: params.maxTokens ?? AI_MAX_TOKENS,
        system:     params.systemPrompt,
        messages: [
          { role: "user", content: params.userPrompt },
        ],
      },
      { signal: controller.signal as AbortSignal }
    );

    clearTimeout(timeout);

    const block = response.content[0];
    if (!block || block.type !== "text") {
      throw new AIProviderError("Empty response from AI provider.");
    }
    return block.text;
  } catch (err: unknown) {
    clearTimeout(timeout);
    if (err instanceof APIKeyMissingError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new AIProviderError("AI request timed out.", "timeout");
    }
    const msg = err instanceof Error ? err.message : "Unknown provider error";
    // Never leak full error details — log server-side, return generic code
    console.error("[AI Provider Error]", msg);
    throw new AIProviderError("AI provider unavailable.", "provider_error");
  }
}

// ── callAIWithStream ──────────────────────────────────────────────────────────
/**
 * Streaming variant for the chat assistant.
 * Returns an async iterable of text chunks.
 */
export async function* callAIStream(params: {
  systemPrompt: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  maxTokens?: number;
}): AsyncGenerator<string> {
  const client = getClient();

  const stream = await client.messages.stream({
    model:      AI_MODEL,
    max_tokens: params.maxTokens ?? 600,
    system:     params.systemPrompt,
    messages:   params.messages,
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
}

// ── safeParseJSON ──────────────────────────────────────────────────────────────
/**
 * Safely parse a JSON string from an AI response.
 * Extracts the first JSON object found in the text (handles markdown code fences).
 */
export function safeParseJSON<T>(text: string): T | null {
  // Strip markdown fences
  const stripped = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  // Try direct parse first
  try {
    return JSON.parse(stripped) as T;
  } catch {
    // Try extracting JSON object/array from mixed text
    const match = stripped.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}
