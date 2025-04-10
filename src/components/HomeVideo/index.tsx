'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomeVideo = () => {
  const router = useRouter();
  const videoURL = '/assets/intro.mp4';

  const routeSelectingFortune = () => {
    router.push('/selectingfortune');
  };

  // ✅ 10초 후 자동 이동 (테스트용)
  useEffect(() => {
    console.log("인트로 진입함!");  // 콘솔 확인용
    const timeout = setTimeout(() => {
      router.push('/selectingfortune');
    }, 10 * 1000); // ⏰ 10초

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <video
        width="100%"
        height="100%"
        aria-label="Video player"
        autoPlay
        loop
        playsInline
        onClick={routeSelectingFortune}
      >
        <source src={videoURL} type="video/mp4" />
      </video>
    </>
  );
};

export default HomeVideo;
