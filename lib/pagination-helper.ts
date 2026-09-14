/**
 * AgriAI Keyset & Offset Pagination Utilities
 * 
 * Provides efficient keyset (cursor-based) and bounded limit-offset pagination
 * to prevent massive unindexed scans and network bandwidth overhead as datasets grow.
 */

export interface KeysetPaginationParams {
  cursor?: string; // ISO timestamp or unique sequential ID
  limit?: number;
  direction?: 'forward' | 'backward';
}

export interface PaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
  prevCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/**
 * Normalizes and clamps pagination limit to prevent memory exhaustion.
 */
export function normalizePageLimit(limit?: number): number {
  if (!limit || isNaN(limit) || limit <= 0) {
    return DEFAULT_PAGE_SIZE;
  }
  return Math.min(Math.floor(limit), MAX_PAGE_SIZE);
}

/**
 * Builds a keyset-paginated result from an array of items.
 * Expects the caller to query limit + 1 rows to detect hasMore.
 */
export function buildKeysetResult<T extends { id?: string; created_at?: string }>(
  items: T[],
  limit: number,
  getCursorValue: (item: T) => string = (item) => item.created_at || item.id || ''
): PaginatedResult<T> {
  const hasMore = items.length > limit;
  const slicedData = hasMore ? items.slice(0, limit) : items;

  const nextCursor =
    hasMore && slicedData.length > 0
      ? getCursorValue(slicedData[slicedData.length - 1])
      : null;

  const prevCursor =
    slicedData.length > 0 ? getCursorValue(slicedData[0]) : null;

  return {
    data: slicedData,
    nextCursor,
    prevCursor,
    hasMore,
    limit,
  };
}

/**
 * Whitelist selective database column selector.
 * Avoids SELECT * and prevents querying unnecessary payload columns.
 */
export function buildSelectiveFields(allowedFields: string[], requestedFields?: string[]): string {
  if (!requestedFields || requestedFields.length === 0) {
    return allowedFields.join(', ');
  }
  const filtered = requestedFields.filter((f) => allowedFields.includes(f));
  return filtered.length > 0 ? filtered.join(', ') : allowedFields.join(', ');
}
