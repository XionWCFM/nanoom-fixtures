# nanoom-fixtures

Real monorepo fixture used to exercise nanoom's affected calculation, matrix
generation, dependency propagation, npm install/run, status aggregation,
sharding, isolation, and release installation paths.

The repository intentionally keeps the workspace scripts small and observable:
each test writes a result file and prints its shard context.
