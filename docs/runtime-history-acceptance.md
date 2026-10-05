# 다음 실행시간 이력의 released consumer 검증

상태: 검증 준비 중. 운영 CI는 기존 affected → checkout/Node/install/run → status와 공개 `@latest`를 사용한다. 이 문서는 검증 기록이며 workflow에 assertion이나 source-tree Action을 추가하지 않는다.

입력은 128개 실제 Next.js workspace의 build/test/typecheck/format:check/lint 640개 작업이다. build cache를 Turbo 설정에 명시한다. 루트 turbo.json은 Nanoom global dependency이므로 이 PR은 전체 workspace의 양성 실행을 검증한다. 제품이 계산한 matrix checkout과 focused install을 그대로 사용한다.

검증은 다음 증거를 각각 기록한다.

- 릴리즈 버전과 Action 소스 SHA, Plan의 정확한 실행 소스 SHA.
- Plan의 모든 작업과 성공 measurement의 일대일 대응, 누락·중복 없는 640개 실행 및 CI status.
- 기준 실행과 새 릴리즈 연속 실행의 assignment task WAPE, 예측/실측 task 합계와 makespan.
- 실제 runner fingerprint, profile별 학습 상태와 최근 요약, 후속 Plan의 history source와 environment uncertainty.
- 준비 시간의 exact/fallback/cold source, artifact JSON/ZIP 크기, lookup 시간, checkout/setup/install/history를 포함한 CI wall time.

작업 subprocess 시간 합계를 workflow wall time으로 해석하지 않는다. runner 큐 대기와 여러 computing profile의 비율이 달라질 수 있으므로 한 번의 실행만으로 전체 CI가 빨라졌다고 주장하지 않는다. 새 릴리즈가 공개되기 전에는 현재 최신 공개 제품으로 기준 실행을 수집한다.

## v0.9.0 공개 제품 검증 시작

Nanoom v0.9.0의 소스는 `f900c08350d647ff53562e367ebdfce22053ad09`다. 5개 플랫폼 빌드와 릴리즈 자산 검증 후 공개됐고, 이 커밋 이후의 fixture 실행에서 운영 `@latest`가 이 소스와 대응 binary를 사용하는지 로그로 확인한다. 다음 실행에서는 실제 runner profile을 학습한 모델을 읽는지 별도로 확인한다.

공개 직전 기준 실행 [37345506680](https://github.com/XionWCFM/nanoom-fixtures/actions/runs/37345506680)은 Plan에 24 assignment와 640개 작업을 생성했다. v0.8.0 Action 소스 `ee834254f875c9f88d9173c9ea075f6917bd9901`을 사용한 `scale-10`, `scale-15`는 binary setup의 release 다운로드가 HTTP 500으로 실패했다. 실행되지 않은 작업을 측정값으로 보충하거나 전체 정확도 비교에 포함하지 않는다. 완전한 과거 기준값은 기존 성공 run `37308453121`에서 유지한다.
