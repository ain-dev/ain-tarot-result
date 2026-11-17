# CLAUDE.md — ain-tarot-result

키오스크 QR 을 폰으로 찍으면 열리는 모바일 결과 페이지(사주·타로·커플궁합).
Next.js 15.5 App Router + React 19 + Chakra UI + TanStack Query + axios. 한국어 전용(i18n 없음).

**스택:** nextjs-vercel-web / 배포: vercel-git

## ⚠️ 반드시 지킬 것

1. **공개 리포다.** 시크릿, `.env*`, 내부 호스트·IP, 매장명, 이미지 digest, 키오스크 운영 내용, 고객 데이터를 커밋하지 않는다. 내부 운영 문서는 비공개 키오스크 리포에 둔다.
2. **`main` 푸시 = 운영 배포.** Vercel Git 연동(`main` → Production, 그 밖의 브랜치 → Preview). 별도 CI 는 없고 Vercel 빌드가 검증이다. 푸시·머지는 명시적 지시가 있을 때만.
3. **`NEXT_PUBLIC_API_BASE_URL` 은 빌드 시점에 baked 된다**(Vercel 프로젝트 환경변수). 빌드 때 비어 있으면 `undefined/...` 로 요청한다. 값을 바꾸면 재배포.
4. **결과 데이터는 키오스크가 아니라 중앙 API 에서 온다.** 키오스크 백엔드에 추가한 필드(예: `luckyPlace`/`luckyNumber`)는 중앙 API 도 내려줘야 여기서 보인다. 새 필드는 nullable 로 받고 없으면 그리지 않는다.
5. **키오스크 결과 화면과 맞춘다.** 키오스크(mindtarot-frontend·singibanggi-frontend)의 결과 화면이 바뀌면 여기 같은 화면(`src/components/{Saju,Tarot,Couple}`)과 응답 타입(`src/model/`)을 확인한다.

## 코드 지도

- 실제 진입점: `src/app/{saju,tarot,couple}/checking/[id]`. `src/app/saju/page.tsx`·`src/app/tarot/page.tsx` 는 일부러 비어 있다.
- API 호출: `src/configs/axios/`(`saju.api.ts`·`tarot.api.ts`·`couple.api.ts`)가 `process.env.NEXT_PUBLIC_API_BASE_URL` 을 직접 쓴다.
- 공용 컴포넌트 `src/components/common/`(예: `LuckyLine.tsx`), 응답 타입 `src/model/cards.ts`.
- 타로 화면은 주제 라벨을 그리지 않는다 → 키오스크의 11~2월 "신년운세" 라벨 전환은 여기 해당 없음.

## 로컬 작업

```bash
npm ci                 # npm 만 쓴다(package-lock.json). yarn.lock 은 없다
npm run dev            # localhost:3000. API 주소는 .env.local(git 제외)의 NEXT_PUBLIC_API_BASE_URL
npx tsc --noEmit       # 타입 점검
```
- Git 훅: pre-commit `lint-staged`, pre-push `npm run build`.
- `npm run mock` 은 `src/mocks/http.ts` 를 찾는데 이 폴더가 리포에 없다 → 지금은 동작하지 않는다(`docs/DEPLOY.md` §2).
- `public/mockServiceWorker.js` 는 로컬 개발 잔여물이다. 커밋하지 않는다(`npx msw init public/` 로 다시 만든다).

## 문서

- 인수인계 `docs/HANDOFF.md`(2026-09-08 — 그 안의 스택 줄은 Next 15.5 / React 19 업그레이드 이전 기준), 배포 사실 `docs/DEPLOY.md`, 보안 `docs/security/`, 결정 기록 `docs/decisions.md`(뒤에 덧붙이기만).
