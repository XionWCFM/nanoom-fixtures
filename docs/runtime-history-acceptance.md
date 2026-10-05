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
