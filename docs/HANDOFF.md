# 인수인계 문서 — ain-tarot-result (모바일 결과 페이지)

최종 갱신: 2026-09-08 (개발 PC 이관 시점)

> ⚠️ 이 저장소는 **문서가 거의 없습니다.** `README.md`는 create-next-app 기본 템플릿 그대로이고
> `CLAUDE.md`·`DEPLOY.md`·CI 워크플로·`.env` 파일이 **전부 없습니다.**
> 이 문서가 사실상 유일한 안내서입니다.

---

## 1. 이게 뭔가

키오스크에서 결과를 받은 손님이 **QR을 폰으로 찍으면 열리는 모바일 결과 페이지**입니다.
키오스크 앱(`mindtarot-frontend`)과 **별개의 배포물**이며, 백엔드 API는 같은 것을 봅니다.

- Next.js 14 App Router + React 18 + Chakra UI + TanStack Query + axios
- 키오스크 앱과 달리 **i18n 없음**(한국어 하드코딩), framer-motion 없음

---

## 2. 실제 진입점은 3개뿐

```
/couple/checking/[id]   커플궁합 결과   ← 2026-08-14 신설 (커밋 8e4a3c2)
/tarot/checking/[id]    타로 결과
/saju/checking/[id]     사주 결과
```

> `src/app/tarot/page.tsx`와 `src/app/saju/page.tsx`는 **빈 컴포넌트**(`<></>`)입니다.
> 삭제되지 않고 남아 있는 것이니 "왜 비어 있지?"로 헤매지 마세요.

### 키오스크 버전과의 차이 (커플궁합 결과 기준)
데이터 구조는 **키오스크와 동일**하되:

| 항목 | 이 레포 (모바일) | 키오스크 |
|---|---|---|
| 다국어 | 없음. 한국어 하드코딩 | next-intl (ko/en/ja/zh) |
| TTS 재생 | 네이티브 `<audio controls>` — **손님이 직접 재생** | 자동 순차 재생 |
| 레이아웃 | 모바일 1열 | 키오스크 세로 대화면 |

TTS를 `controls`로 둔 것은 **모바일 브라우저 autoplay 정책을 피하기 위한 의도**입니다.
자동재생으로 바꾸면 대부분의 모바일에서 소리가 안 납니다.

---

## 3. 🔴 알려진 미결 / 버그

| # | 항목 |
|---|---|
| 1 | **배포 방법이 문서화되어 있지 않습니다.** Dockerfile·CI 워크플로·env 파일이 전무 → 어디에 어떻게 올라가는지 확인 필요. **인수인계 최대 공백** |
| 2 | **`NEXT_PUBLIC_API_BASE_URL` 주입 경로 불명** — 코드가 참조하는 유일한 환경변수인데 `.env` 파일이 레포에 없습니다. 개발 모드는 MSW(`/msw`)로 우회 중 |
| 3 | **`/home` 라우트가 없는데 거기로 보냅니다** — `src/app/layout.tsx`의 무동작 타임아웃이 `router.push('/home')`인데 해당 라우트가 존재하지 않습니다. 주석 "← 인트로 화면 주소로 수정"이 그대로 남아 있는 걸로 보아 **미완 상태**입니다 |
| 4 | **커플궁합 QR이 키오스크에서 임시 비활성화 상태** — 중앙서버에 `/api/couple/*` 라우트가 아직 배포 전이라, 지금은 이 페이지로 오는 트래픽이 없습니다. 키오스크 쪽 재활성화 지점은 `mindtarot-frontend/docs/HANDOFF.md` 참고 |

---

## 4. 이관 시 정리한 것

로컬에 있던 변경 38건을 폐기했습니다 — prettier 재포맷 / CRLF 줄바꿈 노이즈 /
lockfile 재생성분이라 **실제 로직 변경이 없었습니다.**
혹시 몰라 이관 묶음 `_백업_패치/ain-tarot-result_버린변경_2026-09-08.patch`에 백업해 뒀습니다.

> 이 레포는 `package-lock.json`과 `yarn.lock`을 **둘 다** 들고 있습니다.
> 패키지 매니저를 하나로 정리하는 게 좋겠습니다.

---

## 5. 로컬 세팅

```bash
npm install     # 또는 yarn — lockfile이 둘 다 있어 혼선 주의
npm run dev
```
`public/mockServiceWorker.js`(MSW 워커)는 git에 없습니다.
이관 묶음 `01_로컬설정_시크릿/ain-tarot-result/`에서 `public/` 아래로 복사하거나,
`npx msw init public/`로 재생성하세요.
