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

## 첫 v0.9.0 실행: profile 학습과 게시

[37346867363](https://github.com/XionWCFM/nanoom-fixtures/actions/runs/37346867363)은 공개 Action 소스 `f900c08350d647ff53562e367ebdfce22053ad09`와 checksum을 검증한 v0.9.0 binary를 사용했다. 24 assignment의 640개 작업이 성공했고 aggregate status도 성공했다. Plan의 작업 identity와 성공 측정 identity를 대조해 누락·중복이 없음을 확인했다. 준비 시간 관측 24개도 수집됐다.

동일 `ubuntu-latest`에 실제 computing profile은 5개였다. AMD EPYC 7763은 14 assignment, EPYC 9V74는 5개, EPYC 9V45와 Intel Xeon Platinum 8573C는 각각 2개, Xeon 6973P-C는 1개였다. 모두 가용 코어 4개, Ubuntu 이미지 `ubuntu24/20260927.320.1`, Node `v22.23.3`, Yarn `4.11.0`이었다. 독립적인 정렬 JSON SHA-256 계산으로 모든 measurement의 fingerprint가 일치함을 확인했다.

history는 작업 640개와 준비 시간 24개의 관측을 받아들였고 거부된 measurement와 degraded scope가 없었다. 게시된 model과 prediction의 PR #33 scope 모두 같은 5개 profile을 보존했다. profile별 entries 33/146/62/61/392개에는 최근 batch 요약도 모두 존재했다. pool은 670 rows였다. 전체 bundle의 model JSON은 270,430 bytes, prediction JSON은 214,157 bytes였다.

이 첫 실행은 이전 push run `37298255789`의 이력으로 계획했다. 예측 작업 합계 1,762.5초, 실측 합계 2,297.247초, assignment WAPE 25.69%, 예측 task makespan 73.483초, 실측 132.563초였다. 첫 profile 학습 이전의 값이므로 새 학습 모델의 정확도 개선 증거로 해석하지 않는다. 다음 실행이 이 run의 prediction을 읽는지, 여러 profile에서 같은 workspace/task를 학습한 후 그 비용 범위가 후속 Plan에 보이는지 확인한다.
