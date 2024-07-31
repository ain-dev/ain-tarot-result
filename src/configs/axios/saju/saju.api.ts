import axios from 'axios';

export async function postSajuSelect(userSelect: {}) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/saju/result`,
      userSelect,
    );

    if (res.status === 400) {
      return { message: '음성 데이터가 정상적으로 전달되지 않았습니다.' };
    }

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 400) {
        return { message: 'input값을 다시 확인해보세요.' };
      }
    } else {
      throw new Error('Failed to fetch data');
    }
  }
}

export async function getCards(taskId: string) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/saju/result/${taskId}`,
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
