# 배포 — ain-tarot-result (모바일 결과 페이지)

최종 조사: 2026-10-31. `docs/HANDOFF.md` §3-1·3-2("배포 방법 미문서화", "`NEXT_PUBLIC_API_BASE_URL` 주입 경로 불명")의 답입니다.
아래 "확인됨"은 실제 응답·기록으로 확인한 것, "추정"은 근거는 있지만 대시보드/서버 코드로 확인하지 못한 것입니다.

---

## 1. 요약

| 항목 | 값 | 근거 |
|---|---|---|
| 호스팅 | **Vercel** 팀 `ain-dev-132c7931`, 프로젝트 `ain-tarot-result` | 확인됨 — GitHub 커밋 상태의 Vercel 링크 `vercel.com/ain-dev-132c7931/ain-tarot-result/...` |
| 운영 도메인 | `https://ain-tarot-result.vercel.app` (커스텀 도메인 없음으로 보임) | 확인됨 — GitHub 리포 homepage, 백엔드 `MOBILE_DOMAIN`, 응답 헤더 `Server: Vercel` |
| 배포 방식 | **Git 연동 자동 배포** — `main` 푸시 → Production, 그 외 브랜치 푸시 → Preview | 확인됨 — GitHub Deployments 생성자가 `vercel[bot]`. `main`(dc63a20)=Production, `fix/tarot-result-ssr`(2cd87f4)=Preview |
| CI | 없음 (GitHub Actions 워크플로 없음). Vercel 빌드가 곧 검증 | 확인됨 |
| 패키지 매니저 | 이 브랜치부터 **npm** (`package-lock.json`만 유지) | 아래 §4 |
| Node 버전 | **미확인** — Vercel 프로젝트 설정값. `package.json`에 `engines` 없음 | 대시보드 Settings → Build and Deployment → Node.js Version 확인 필요 |
| 함수 리전 | `iad1`(미국 동부)로 보임 — 응답 헤더 `X-Vercel-Id: hnd1::iad1::...` | 확인됨(헤더). 의도된 설정인지는 미확인 |

> Vercel CLI로 `vercel project ls` / `vercel inspect` / `vercel env ls` 를 하려 했으나,
> 이 개발 PC에는 **Vercel CLI가 설치돼 있지 않고 로그인 정보도 없었습니다**(2026-10-31 기준).
> 그래서 위 내용은 GitHub Deployments API와 공개 응답으로 확인했습니다.
> 환경변수 목록·Node 버전·Install Command 오버라이드 여부는 대시보드에서 확인해야 합니다.

### 최근 배포 기록 (GitHub Deployments)

| 일시(UTC) | 환경 | 커밋 | URL |
|---|---|---|---|
| 2026-09-09 01:17 | Preview | 2cd87f4 (`fix/tarot-result-ssr`) | `ain-tarot-result-hjpk8gl0p-ain-dev-132c7931.vercel.app` |
| 2026-09-08 13:09 | Production | dc63a20 (`main`) | `ain-tarot-result-9sctlif1o-ain-dev-132c7931.vercel.app` |
| 2026-08-14 02:56 | Production | bea72bd (`main`) | `ain-tarot-result-nm57tu9c3-ain-dev-132c7931.vercel.app` |

---

## 2. 환경변수

코드가 읽는 환경변수는 **`NEXT_PUBLIC_API_BASE_URL` 하나**입니다.

- 운영 값: **`https://ain-tarot.kr/api`** — 운영 JS 번들(`/_next/static/chunks/app/*/page-*.js`)에 baked 된 값을 직접 확인.
- 레포에 `.env*` 파일이 없으므로 **Vercel 프로젝트 환경변수**(Production/Preview)로 주입되고 있는 것으로 봅니다.
  Preview 환경에도 같은 값이 들어가 있는지는 대시보드에서 확인 필요.
- `NEXT_PUBLIC_*` 는 **빌드 시점에 번들에 박힙니다.** 값을 바꾸면 재배포(재빌드)해야 반영됩니다.
  빌드 때 비어 있으면 `undefined/couple/result/...` 로 요청하게 됩니다.
- 개발 모드(`npm run dev`)에서 `src/configs/axios/instance.ts`는 `/msw`를 쓰지만,
  실제 API 함수(`couple.api.ts`, `saju.api.ts`, `tarot.api.ts`)는 `instance`가 아니라
  `process.env.NEXT_PUBLIC_API_BASE_URL` 을 직접 씁니다. 즉 **MSW 우회는 현재 동작하지 않고**,
  `src/mocks/` 도 레포에 없습니다. 로컬 확인은 `.env.local` 에 API 주소를 넣거나 목 서버를 띄워야 합니다.

---

## 3. 요청 경로 (폰 → 데이터)

```
[키오스크] 결과 생성 (로컬 mindtarot-backend, 로컬 Postgres)
   └ QR 생성: MOBILE_DOMAIN/{saju|tarot|couple}/checking/{desc_res_id}
                 = https://ain-tarot-result.vercel.app/...
[손님 폰] QR 스캔
   └ Vercel(ain-tarot-result) — 페이지 셸만 SSR, 데이터는 브라우저에서 조회
       └ 브라우저 → GET https://ain-tarot.kr/api/{saju|tarot|couple}/result/{id}
            = "중앙서버" (223.130.158.35, openresty + FastAPI)
              └ ??? → 키오스크의 결과 데이터
       └ 카드 이미지: R2 공개 버킷 (pub-…r2.dev) — next/image 최적화 경유
       └ TTS 음성: 응답의 URL을 <audio> 로 직접 재생
```

- `ain-tarot.kr/api` 는 키오스크 백엔드의 `KEY_RENT_SERVER` 와 **같은 서버**입니다
  (`mindtarot-backend/.env`, `docker-compose.yml`). API 키 대여(`/api_key/*`)와
  키오스크 등록(`/kiosk/register`, 지점명 + 공인 IP — `saju_tarot/__init__.py:78`)을 하는 그 중앙서버입니다.
- 중앙서버의 공개 OpenAPI(`https://ain-tarot.kr/openapi.json`)에 있는 결과 조회 라우트는
  `GET /api/saju/result/{id}`, `GET /api/tarot/result/{id}` **두 개뿐**이고 `couple`은 없습니다.
- **중앙서버 코드는 `C:\Users\minid\Desktop\ain\project` 에 없습니다.** 키오스크 백엔드에는
  결과를 중앙서버로 올리는 코드가 없으므로, 중앙서버가 등록된 키오스크 공인 IP로 **프록시**하는
  구조로 **추정**합니다(오류 문구 `Data Not Found`, `STT Not Found` 가 키오스크 백엔드에 없는 문구).

### 커플궁합 라우트 프로브 (2026-10-31, GET, 인증 없음)

| 요청 | 응답 | 해석 |
|---|---|---|
| `GET /api/couple/result/00000000-…` | 404 `{"detail":"Not Found"}` | FastAPI 기본 404 = **라우트 없음** |
| `GET /api/saju/result/00000000-…` | 404 `{"detail":"Data Not Found"}` | 라우트 있음, id 없음 |
| `GET /api/tarot/result/00000000-…` | 404 `{"detail":"STT Not Found"}` | 라우트 있음, id 없음 |

→ **커플궁합 QR 결과 페이지는 중앙서버에 `/api/couple/result/{id}` 가 배포되기 전까지 동작할 수 없습니다.**
  (`HANDOFF.md` §3-4와 일치. 프론트 쪽은 418 폴링·404 안내까지 준비 완료.)
  키오스크 백엔드의 `GET /couple/result/{id}` 는 생성 중이면 418, 결과는 `expire_at`(생성 후 3일) 보관.

---

## 4. 패키지 매니저 / lockfile

- Vercel은 lockfile로 패키지 매니저를 고릅니다. **같은 폴더에 `yarn.lock` 과 `package-lock.json` 이 둘 다 있으면
  `yarn.lock` 이 우선**입니다(`vercel/vercel` `packages/build-utils/src/fs/run-user-scripts.ts`:
  "Priority order is bun with yarn lock > yarn > pnpm > npm"). 즉 **지금까지 운영 빌드는 `yarn install`(Yarn 1)** 로
  돌았을 가능성이 높습니다(프로젝트에 Install Command 오버라이드가 없다면).
- 반면 `package-lock.json` 은 `package.json` 과 어긋나 있어 `npm ci` 가 실패했습니다(`cors` 누락).
- 문서(`HANDOFF.md`)와 형제 레포(mindtarot-frontend)는 npm 기준이라, 이 브랜치에서 **`yarn.lock` 을 삭제하고
  `package-lock.json` 을 재생성**했습니다. **다음 배포부터 Vercel 설치 명령이 `yarn install` → `npm install` 로 바뀝니다.**
  Preview 배포의 빌드 로그에서 `npm install` 로 잡히는지 확인하세요.

---

## 5. 배포 절차

1. 기능 브랜치 푸시 → Vercel이 자동으로 **Preview** 배포(URL은 PR/커밋 상태에 표시).
2. Preview URL에서 확인: `/tarot/checking/<실제id>`, `/saju/checking/<실제id>`, (중앙서버 라우트 배포 후) `/couple/checking/<실제id>`.
3. `main` 에 머지 → 자동으로 **Production** 배포.
4. 롤백: Vercel 대시보드 → Deployments → 이전 Production 배포 → "Promote to Production"(Instant Rollback).

CLI로 Preview를 수동으로 올릴 때(로그인·`vercel link` 필요, 운영 영향 없음):

```bash
vercel deploy --scope ain-dev-132c7931   # --prod 를 붙이지 않으면 Preview
```

---

## 6. 확인이 필요한 것 (사내 질문)

1. 중앙서버(`ain-tarot.kr`)의 코드 저장소·담당자·배포 방법은? `/api/couple/result/{id}` 추가 일정은?
2. 중앙서버가 결과를 어떻게 가져오나요? (키오스크 공인 IP로 프록시? 별도 동기화?) id → 키오스크 매핑 방식은?
3. Vercel 프로젝트의 Node.js 버전, Install/Build Command 오버라이드, Preview 환경의 `NEXT_PUBLIC_API_BASE_URL` 값.
4. Vercel 함수 리전이 `iad1`(미국)인 것은 의도인가요? 손님이 한국이라 `icn1` 이 자연스럽습니다(페이지 셸 SSR만 해당).
5. 중앙서버 OpenAPI가 공개돼 있고, 스펙상 `/api/api_key/*`·`/api/kiosk/*` 에 인증 스킴이 없습니다 → `docs/security/2026-10.md` 참고.
