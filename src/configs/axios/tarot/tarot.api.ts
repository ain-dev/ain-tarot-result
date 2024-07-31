import axios from 'axios';

export async function postSpeech(speechInput: any) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/tarot/stt`,
      speechInput,
    );

    if (res.status === 400) {
      return { message: 'input값이 빠졌슴둥' };
    }

    return res.data;
  } catch (error) {
    throw new Error('Failed to postSpeech data');
  }
}

export async function postTarotSelect(userSelect: any) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/tarot/result`,
      userSelect,
    );

    if (res.status === 400) {
      return { message: 'input값을 다시 확인해보세요' };
    }

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 400) {
        return { message: 'input값을 다시 확인해보세요' };
      }
    } else {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data');
    }
  }
}

export async function getCards(taskId: string) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/tarot/result/${taskId}`,
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );

    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    return res.data;
  } catch (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
}
