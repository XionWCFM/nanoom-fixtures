# nanoom-fixtures

최신 공개 Nanoom Action을 실제 소비자 경로에서 검증하는 Yarn + Turbo 저장소입니다.
128개 Next.js service의 변경을 계획하고, Plan의 소스 SHA와 sparse checkout,
focused install, 실제 build/test/typecheck, aggregate status를 확인합니다.

운영 CI는 `affected → run → status`로 구성합니다. run은 공식 checkout →
Node 설정 → Nanoom focused install → Nanoom run의 네 단계입니다.
양성 변경은 모든 계획된 assignment를 실행하며, 변경 없음은 run을 정상 생략합니다.

개발 환경 설치와 로컬 검사 명령은 [기여 가이드](CONTRIBUTING.md)에 있습니다.
Next.js TypeScript 옵션은 `tsconfig.next.json`, 패키지 버전은 `.yarnrc.yml`의
catalog를 사용합니다. 실제 workspace의 Vite/Vitest 도구는 각 package에 선언합니다.

## 별도 검증 fixture

- `packages/*`: 내부 dependency closure와 focused install을 검증하는 작은 fixture.
- `fixtures/pnpm-nx`: pnpm + Nx의 실제 설치·실행 fixture.
- `scripts/generate-scale-fixture.mjs`: Next service 생성 규칙.
- `scripts/scale-scenario.mjs`: small/medium/full 변경 계획. 기본 실행은 파일을 바꾸지 않습니다.
- [공개 v0.7.7 실행 증거](docs/validation/v0.7.7-released-path.md).
