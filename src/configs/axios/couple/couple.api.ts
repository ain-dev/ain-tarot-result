import axios from 'axios';

/**
 * Why a couple result request failed.
 * - generating: backend answered 418 ("정보 준비 중입니다") — the result is still
 *   being generated, keep polling.
 * - notFound: 404/410/422 — unknown id, or the result already expired
 *   (backend `expire_at` = created_at + 3 days, expired results answer 404).
 * - unavailable: network error or 5xx — transient, worth a few retries.
 */
export type CoupleResultErrorKind = 'generating' | 'notFound' | 'unavailable';

export class CoupleResultError extends Error {
  kind: CoupleResultErrorKind;

  status?: number;

  constructor(kind: CoupleResultErrorKind, status?: number) {
    super(`Couple result request failed: ${kind}`);
    this.name = 'CoupleResultError';
    this.kind = kind;
    this.status = status;
  }
}

export const isCoupleResultError = (
  error: unknown,
): error is CoupleResultError => error instanceof CoupleResultError;

export async function getCoupleResult(taskId: string) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/couple/result/${encodeURIComponent(taskId)}`,
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );

    return res.data;
  } catch (error) {
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;

    if (status === 418) throw new CoupleResultError('generating', status);
    if (status === 404 || status === 410 || status === 422) {
      throw new CoupleResultError('notFound', status);
    }
    throw new CoupleResultError('unavailable', status);
  }
}
