# 다음 실행시간 이력의 released consumer 검증

상태: 공개 v0.9.0의 연속 실행과 환경별 학습·다음 Plan 반영을 검증했다. 운영 CI는 기존 affected → checkout/Node/install/run → status와 공개 `@latest`를 사용한다. 이 문서는 검증 기록이며 workflow에 assertion이나 source-tree Action을 추가하지 않는다.

입력은 128개 실제 Next.js workspace의 build/test/typecheck/format:check/lint 640개 작업이다. 검증 중 build cache의 기본값인 `true`를 루트 Turbo 설정에 명시해 global dependency의 양성 변경으로 전체 workspace를 실행했다. 최종 변경에서는 이 중복 설정을 제거했다. Turbo 2.10.11의 실제 dry-run에서 133개 build 작업의 `resolvedTaskDefinition.cache`가 모두 `true`인 것을 확인해 동작이 같음을 검증했다. 제품이 계산한 matrix checkout과 focused install을 그대로 사용했다.

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

## 후속 실행: 다음 예측의 오차와 누적 profile

[37348388715](https://github.com/XionWCFM/nanoom-fixtures/actions/runs/37348388715)은 이전 run `37346867363`의 prediction을 1.375초에 읽었다. 640개 작업 모두 exact history였고 예측 작업 합계 2,297.247초가 이전 실측 합계와 일치했다. 공개 v0.9.0으로 24 assignment·640개 작업 및 aggregate status가 모두 성공했다. Plan과 측정 identity의 누락·중복이 없었다.

작업 실측 합계는 2,079.574초, assignment WAPE는 23.84%, 예측 task makespan은 96.044초, 실측은 149.095초였다. 첫 실행의 WAPE 25.69%보다 낮지만 makespan은 늘었다. CPU 분포와 외부 준비 비용이 달라진 실제 CI 두 번의 결과이며 일반적인 성능 개선을 증명하지 않는다.

Xeon Platinum 8370C가 추가로 관측돼 누적 profile은 6개였다. history는 추가 관측 664개를 받아들였고 거부된 measurement·degraded scope가 없었다. 각 profile의 모든 entry에 최근 batch 요약이 존재했으며, 226개 profile entry는 최근 batch가 두 개 이상이었다. 450개 key가 여러 profile의 prediction table에 존재했다. 이 숫자는 task·group fallback·preparation key를 포함하며 작업 450개라는 뜻이 아니다. pool은 694 rows, 전체 model JSON은 386,445 bytes, prediction JSON은 266,808 bytes였다.

이 기록 이후 새 실행의 Plan에서 누적 prediction을 읽고 `environmentUncertainty`의 작업 수·최소/최대 작업 비용을 보존하는지 검증한다. 해당 범위는 여러 profile에서 관측한 작업 비용이며 전체 assignment wall time의 신뢰구간이 아니다.

## 누적 profile 비용 범위를 사용한 실행

[37349596782](https://github.com/XionWCFM/nanoom-fixtures/actions/runs/37349596782)의 Plan은 이전 run `37348388715`의 prediction을 1.27초에 읽었다. 640개 작업 중 444개가 여러 profile의 비용 범위를 가졌고, 24개 assignment 모두 `environmentUncertainty`를 보존했다. 해당 작업들의 최소 비용 합계는 1,263.564초, 최대는 1,788.290초였다. 전체 작업 예측 합계는 2,188.569초다.

24 assignment·640개 작업과 aggregate status가 모두 성공했다. Plan/measurement의 작업 identity가 누락·중복 없이 대응했다. 실측 작업 합계는 2,168.966초, assignment WAPE는 18.48%, task makespan 예측은 91.505초 / 실측은 145.096초였다. 첫 실행부터 WAPE는 25.69% → 23.84% → 18.48%였지만, 실제 task makespan은 132.563초 → 149.095초 → 145.096초였다. 표본 3회의 runner 분포·네트워크 조건이 다르므로 일반적인 속도 개선을 주장하지 않는다.

세 번째 측정에서도 6개 CPU profile을 관측했고 모든 fingerprint를 독립 SHA-256과 대조했다. 게시된 model/prediction에 6개 profile이 모두 보존됐다. profile entries 1,467개에는 최근 batch 요약이 1~3개씩 존재했다. pool은 718 rows, 전체 model JSON은 469,136 bytes, prediction JSON은 300,466 bytes였다. model과 prediction은 각각 16/8 MiB 한도 안에 있다.

전체 CI 완료 시간은 초기 큐 대기를 포함해 619초 → 441초 → 609초였고 status 잡은 28초 → 14초 → 21초였다. 세 번째 실행의 가장 오래 걸린 checkout은 455초였다. task 비용의 정확도와 외부 준비 비용을 포함한 wall time은 별도 지표다. status의 수집·학습·게시를 별도 workflow로 분리하는 변경은 이 검증에서 수행하지 않았다.

제품 수용 증거는 이 3회 실행에서 기록했다. 이후 문서 정리 커밋에서도 기존 공개 템플릿의 CI를 그대로 실행하며 이 숫자를 새 실행의 결과로 바꾸지 않는다. 중복 cache 설정을 제거한 최종 PR diff는 이 문서뿐이다. 이 최종 커밋에서는 변경 없음의 정상 run 생략과 aggregate status 성공을 별도로 확인한다.
