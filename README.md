# nanoom-fixtures

Nanoom의 released Action을 실제 소비자 관점에서 검증하는 monorepo fixture다.
루트의 Yarn Berry + Turborepo와 `fixtures/pnpm-nx`의 pnpm + Nx를 함께 실행한다.

The repository intentionally keeps the workspace scripts small and observable:
each test writes a result file and prints its shard context.

Hosted workflow는 affected assignment, 여러 workspace의 focused install,
실제 Turbo/Nx task 실행, 성공 실행시간 sample, artifact history 병합, needs-only
aggregate status를 각각 확인한다.

Yarn 경로는 checkout 뒤 `packages/shared/changed.txt`를 커밋해 실제 shared
변경을 만들고, 그 커밋을 기준으로 Turbo affected matrix를 실행한다.

128-service scale fixture는 다음 명령으로 변경 계획을 한 줄 JSON으로 확인한다.

```bash
node scripts/scale-scenario.mjs small
node scripts/scale-scenario.mjs medium
node scripts/scale-scenario.mjs full
```

각 시나리오는 12/64/128 workspace와 concurrency 3/12/24를 고정한다. CI만
`--apply`를 사용해 임시 비교 commit을 만들며, 일반 실행은 파일을 바꾸지 않는다.
small, medium, full은 서로 다른 workflow run에서 실행되어 timing sample과
history가 섞이지 않는다. Actions 화면에서 각 workflow를 개별 재실행할 수 있다.

로컬 commit hook의 `format`, `typecheck`, `build`는 각각 oxfmt와 Turbo의
동일 이름 task를 실행한다.
