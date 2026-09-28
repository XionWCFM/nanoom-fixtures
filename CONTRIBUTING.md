# 개발과 기여

## 처음 시작하기

저장소 루트에서 다음 명령을 실행합니다. Node는 `mise.toml`, Yarn은
`package.json`의 `packageManager`를 기준으로 선택합니다.

```sh
mise install
mise exec -- corepack enable
mise exec -- yarn install --immutable
mise exec -- yarn prepare
```

`yarn prepare`는 커밋 hook을 설치합니다. hook은 staged 파일의 포맷과 해당
언어 검사를 실행합니다. 전체 저장소 검사와 build는 아래 명령으로 별도 실행합니다.
hook 실패를 생략해 커밋하지 말고 같은 명령의 오류를 수정합니다.

## 수정과 검증

```sh
mise exec -- yarn format
mise exec -- yarn format:check
mise exec -- yarn check
```

`format`은 파일을 수정하고 `format:check`는 수정하지 않습니다. VS Code의
추천 확장을 설치하면 같은 formatter로 저장 시 포맷을 적용합니다.

버그 보고에는 실행 버전, OS, 최소 재현 입력, 예상 결과와 실제 결과를 남깁니다.
PR에는 사용자에게 달라지는 동작과 실행한 검증을 기록합니다. 공개 동작 변경은
회귀 테스트와 문서를 함께 수정합니다. Nanoom 운영 CI는 최신 공개 Action과
해당 릴리즈 binary를 사용하며, 로컬 build를 공개 제품 실행 증거로 대신하지 않습니다.

워크플로 변경은 AGENTS.md의 diff 승인 절차를 따릅니다.

## fixture 작업

`yarn lint`, `yarn knip`, `yarn typecheck`, `yarn test`, `yarn build`를
각각 실행할 수 있습니다. `yarn check`는 이를 포맷 검사와 함께 실행합니다.
fixture 수를 바꾸는 작업은 `scripts/generate-scale-fixture.mjs`를 사용해
생성 규칙과 기존 fixture를 같이 유지합니다. hosted 실행은 실제 변경의
matrix와 변경 없음의 정상 생략을 각각 확인합니다.

Knip의 root `next` 예외는 공통 `tsconfig.next.json`의 Next plugin 이름에만
적용합니다. 실제 Next 의존성은 각 service에 선언하고 검사합니다.
새 fixture를 생성한 뒤에는 `yarn format`으로 소스 포맷을 맞춥니다.

`next-env.d.ts`는 커밋하지 않습니다. `typecheck`는 `next typegen`으로
필요한 타입을 생성한 뒤 tsc를 실행하므로 처음 설치한 checkout에서도 동작합니다.

포맷 명령은 workflow를 수정하지 않습니다. workflow는 AGENTS.md의
승인 절차와 CI 계약 검증으로 따로 검토합니다.
