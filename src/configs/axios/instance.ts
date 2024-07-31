import axios from 'axios';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? '/msw'
    : process.env.NEXT_PUBLIC_API_BASE_URL;

/* 백엔드 도메인 연결 (개발, 운영 나누지 x) */
// const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// interceptor

export default instance;
