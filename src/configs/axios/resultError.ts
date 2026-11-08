import axios from 'axios';

/**
 * Why a result request (tarot / saju / couple) failed.
 * - generating: backend answered 418 ("정보 준비 중입니다") — the result is still
 *   being generated, keep polling.
 * - notFound: 404/410/422 — unknown id, or the result already expired
 *   (backend `expire_at` = created_at + 3 days, expired results answer 404).
 * - unavailable: network error or 5xx — transient, worth a few retries.
 */
export type ResultErrorKind = 'generating' | 'notFound' | 'unavailable';

export class ResultError extends Error {
  kind: ResultErrorKind;

  status?: number;

  constructor(kind: ResultErrorKind, status?: number) {
    super(`Result request failed: ${kind}`);
    this.name = 'ResultError';
    this.kind = kind;
    this.status = status;
  }
}

export const isResultError = (error: unknown): error is ResultError =>
  error instanceof ResultError;

/** Map an axios failure to a ResultError so the UI can tell the cases apart. */
export const toResultError = (error: unknown): ResultError => {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;

  if (status === 418) return new ResultError('generating', status);
  if (status === 404 || status === 410 || status === 422) {
    return new ResultError('notFound', status);
  }
  return new ResultError('unavailable', status);
};
