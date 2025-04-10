'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomeVideo = () => {
  const router = useRouter();

  // 5분 동안 아무 활동이 없으면 자동 종료 (홈으로 리디렉션)
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      router.push('/');  // 홈 화면으로 리디렉션
    }, 5 * 60 * 1000); // 5분

    // 컴포넌트가 언마운트되면 타이머를 정리
    return () => clearTimeout(idleTimer);
  }, [router]);

  return (
    <>
      <video
        width="100%"
        height="100%"
        aria-label="Video player"
        autoPlay
        loop
        playsInline
      >
        <source src="/assets/intro.mp4" type="video/mp4" />
      </video>
    </>
  );
};

export default HomeVideo;
