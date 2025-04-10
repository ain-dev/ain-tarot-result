'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const HomeVideo = () => {
  const router = useRouter();
  const videoURL = '/assets/intro.mp4';

  // 타이머를 설정할 상태 변수
  const [idleTime, setIdleTime] = useState(0);

  const routeToIntro = () => {
    router.push('/');  // 홈(인트로) 화면으로 리디렉션
  };

  // 사용자가 클릭했을 때 idle 타이머 리셋
  const resetIdleTimer = () => {
    setIdleTime(0);
  };

  // 10분 간격으로 타이머를 체크
  useEffect(() => {
    const idleTimer = setInterval(() => {
      setIdleTime((prevTime) => {
        if (prevTime >= 10) {
          routeToIntro();  // 10분 동안 아무런 활동이 없으면 인트로로 돌아감
          clearInterval(idleTimer);  // 타이머 멈추기
        }
        return prevTime + 1;  // 매 1초마다 증가
      });
    }, 1000); // 1초마다 체크

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearInterval(idleTimer);
  }, []);

  // 클릭이나 키보드 입력 시 타이머 리셋
  useEffect(() => {
    const handleActivity = () => {
      resetIdleTimer();  // 활동이 있으면 타이머 리셋
    };

    // 이벤트 리스너 등록 (클릭, 키보드 입력 등)
    document.addEventListener('click', handleActivity);
    document.addEventListener('keydown', handleActivity);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 정리
    return () => {
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('keydown', handleActivity);
    };
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
      >
        <source src={videoURL} type="video/mp4" />
      </video>
    </>
  );
};

export default HomeVideo;

