# nanoom-fixtures

Real monorepo fixture used to exercise nanoom's affected calculation, matrix
generation, dependency propagation, npm install/run, status aggregation,
sharding, isolation, and release installation paths.

The repository intentionally keeps the workspace scripts small and observable:
each test writes a result file and prints its shard context.

The hosted workflow creates a shared-only commit, asserts the exact direct and
transitive affected reasons, verifies each focused install contains root dev
tools and the selected dependency closure without the ignored unrelated
workspace, then runs and aggregates all four matrix entries.
