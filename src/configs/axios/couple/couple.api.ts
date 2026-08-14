import axios from 'axios';

export async function getCoupleResult(taskId: string) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/couple/result/${taskId}`,
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );

    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
}
