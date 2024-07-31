// app/fonts.ts
import localFont from 'next/font/local';

export const pretendard = localFont({
  src: [
    {
      path: '../fonts/pretendard/Pretendard-Regular.woff',
      weight: '400',
    },
    {
      path: '../fonts/pretendard/Pretendard-Medium.woff',
      weight: '500',
    },
    {
      path: '../fonts/pretendard/Pretendard-Bold.woff',
      weight: '700',
    },
  ],
});

export const hahmlet = localFont({
  src: [
    {
      path: '../fonts/hahmlet/Hahmlet-Regular.otf',
      weight: '400',
    },
    {
      path: '../fonts/hahmlet/Hahmlet-Medium.otf',
      weight: '500',
    },
    {
      path: '../fonts/hahmlet/Hahmlet-Bold.otf',
      weight: '700',
    },
  ],
});
