/**
 * AgriAI Production Structured Logger
 * 
 * Standardized JSON logging with automatic PII & sensitive secret redaction,
 * correlation tracking (x-request-id), and serverless execution safety.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /auth/i,
  /bearer/i,
  /api[_-]?key/i,
  /credential/i,
  /private[_-]?key/i,
  /cookie/i,
  /aadhaar/i,
  /session/i,
];

const SENSITIVE_VALUE_REGEXES = [
  // Email address
  { pattern: /([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})/g, replacement: '$1***@***.$3' },
  // Phone numbers (Indian 10-digit formats)
  { pattern: /(\+?91[\-\s]?)?[6-9]\d{9}/g, replacement: '[REDACTED_PHONE]' },
  // Bearer tokens or hex secrets
  { pattern: /Bearer\s+[a-zA-Z0-9._\-]+/gi, replacement: 'Bearer [REDACTED_TOKEN]' },
  // Standard API key formats (AIzaSy, sk-, etc.)
  { pattern: /AIza[0-9A-Za-z-_]{35}/g, replacement: '[REDACTED_API_KEY]' },
  { pattern: /sk-[0-9a-zA-Z]{20,}/g, replacement: '[REDACTED_API_KEY]' },
];

/**
 * Deeply sanitizes an object or value, masking sensitive fields and PII.
 */
export function sanitizeLogData<T>(data: T, seen = new WeakSet()): T {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    let sanitizedStr: string = data;
    for (const { pattern, replacement } of SENSITIVE_VALUE_REGEXES) {
      sanitizedStr = sanitizedStr.replace(pattern, replacement);
    }
    return sanitizedStr as unknown as T;
  }

  if (typeof data !== 'object') {
    return data;
  }

  if (seen.has(data as object)) {
    return '[CIRCULAR_REFERENCE]' as unknown as T;
  }
  seen.add(data as object);

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeLogData(item, seen)) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    const isSensitiveKey = SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
    if (isSensitiveKey) {
      result[key] = '[REDACTED]';
    } else {
      result[key] = sanitizeLogData(value, seen);
    }
  }

  return result as T;
}

export interface LogContext {
  requestId?: string;
  userId?: string;
  farmId?: string;
  source?: string;
  endpoint?: string;
  durationMs?: number;
  [key: string]: unknown;
}

export class Logger {
  private baseContext: LogContext;

  constructor(context: LogContext = {}) {
    this.baseContext = context;
  }

  public child(extraContext: LogContext): Logger {
    return new Logger({
      ...this.baseContext,
      ...extraContext,
    });
  }

  private output(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    const payload = sanitizeLogData({
      timestamp,
      level,
      message,
      ...this.baseContext,
      ...(meta || {}),
    });

    const isDev = process.env.NODE_ENV === 'development';

    if (isDev && !process.env.FORCE_JSON_LOGS) {
      const colorMap: Record<LogLevel, string> = {
        debug: '\x1b[34m', // Blue
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m', // Red
      };
      const reset = '\x1b[0m';
      const color = colorMap[level] || reset;
      const contextPrefix = this.baseContext.requestId ? `[${this.baseContext.requestId}] ` : '';
      
      console.log(
        `${color}[${level.toUpperCase()}]${reset} ${timestamp} - ${contextPrefix}${message}`,
        meta ? meta : ''
      );
    } else {
      const jsonString = JSON.stringify(payload);
      if (level === 'error') {
        console.error(jsonString);
      } else if (level === 'warn') {
        console.warn(jsonString);
      } else {
        console.log(jsonString);
      }
    }
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'production' || process.env.LOG_LEVEL === 'debug') {
      this.output('debug', message, meta);
    }
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    this.output('info', message, meta);
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    this.output('warn', message, meta);
  }

  public error(message: string, meta?: Record<string, unknown>): void {
    this.output('error', message, meta);
  }
}

export const logger = new Logger({ source: 'agriai-app' });
