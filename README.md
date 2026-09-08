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
