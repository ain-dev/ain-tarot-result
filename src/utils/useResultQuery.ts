'use client';

import { useQuery, type QueryKey } from '@tanstack/react-query';
import { ResultError, isResultError } from '@/configs/axios/resultError';

// 418 polling: 2s → ×1.5 backoff capped at 10s, ~6 minutes in total.
export const MAX_GENERATING_POLLS = 40;
// Network error / 5xx: 1s → 2s → 4s, then show the error state with a retry
// button instead of keeping the customer waiting for minutes.
export const MAX_UNAVAILABLE_RETRIES = 3;

/**
 * Why there is nothing to show once the query has settled without data.
 * - notFound: 404/410/422 — unknown or expired id, retrying will not help.
 * - unreachable: no HTTP response at all after the retry cap (network/CORS).
 * - delayed: still 418 "generating" after the polling cap.
 * - failed: anything else (5xx, unexpected error, request paused offline).
 */
export type ResultErrorState =
  'notFound' | 'unreachable' | 'delayed' | 'failed';

/**
 * Shared fetch + retry policy for the tarot / saju / couple result pages.
 */
export function useResultQuery<T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
) {
  const query = useQuery<T, ResultError>({
    queryKey,
    queryFn,
    retry: (failureCount, err) => {
      if (!isResultError(err)) return failureCount < MAX_UNAVAILABLE_RETRIES;
      if (err.kind === 'notFound') return false; // unknown id or expired
      if (err.kind === 'generating') return failureCount < MAX_GENERATING_POLLS;
      return failureCount < MAX_UNAVAILABLE_RETRIES;
    },
    retryDelay: (attemptIndex, err) =>
      isResultError(err) && err.kind === 'generating'
        ? Math.min(2000 * 1.5 ** attemptIndex, 10000)
        : Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data, error, failureReason, isFetching } = query;

  // While TanStack Query is retrying, the latest error is exposed as
  // `failureReason` (not `error`), so use it to tell "still generating" apart.
  const lastError = error ?? failureReason;
  const isGenerating =
    data === undefined &&
    isResultError(lastError) &&
    lastError.kind === 'generating';

  let errorState: ResultErrorState | null = null;
  if (!isFetching && data === undefined) {
    if (isResultError(error) && error.kind === 'notFound') {
      errorState = 'notFound';
    } else if (
      isResultError(error) &&
      error.kind === 'unavailable' &&
      error.status === undefined
    ) {
      errorState = 'unreachable';
    } else if (isGenerating) {
      errorState = 'delayed';
    } else {
      errorState = 'failed';
    }
  }

  return { ...query, isGenerating, errorState };
}
