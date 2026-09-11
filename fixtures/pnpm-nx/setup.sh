#!/usr/bin/env bash
set -euo pipefail

destination=${1:-.pnpm-nx-fixture}
mkdir "$destination"
git archive HEAD:fixtures/pnpm-nx | tar -x -C "$destination"
git -C "$destination" init -q -b main
git -C "$destination" config user.email fixture@example.invalid
git -C "$destination" config user.name nanoom-fixture
git -C "$destination" add .
git -C "$destination" commit -q -m init
git -C "$destination" switch -q -c feature
printf 'changed\n' > "$destination/packages/shared/changed.txt"
git -C "$destination" add packages/shared/changed.txt
git -C "$destination" commit -q -m change
