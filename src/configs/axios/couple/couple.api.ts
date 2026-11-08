import axios from 'axios';
import { toResultError } from '@/configs/axios/resultError';

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
    throw toResultError(error);
  }
}
