const getNewThresholds = require('../getNewThresholds')

it('returns empty object if no thresholds are defined', () => {
  const newThresholds = getNewThresholds({})

  expect(newThresholds).toStrictEqual({})
})

it('returns new thresholds if coverages are higher', () => {
  const thresholds = {
    branches: 10,
    functions: 20,
    lines: 30,
    statements: 40,
  }
  const coverages = {
    branches: { pct: 80 },
    functions: { pct: 70 },
    lines: { pct: 60 },
    statements: { pct: 50 },
  }
  const margin = 0
  const tolerance = 0
  const precision = 2

  const newThresholds = getNewThresholds(
    thresholds,
    coverages,
    margin,
    tolerance,
    precision,
  )

  expect(newThresholds).toStrictEqual({
    branches: { diff: 70, next: 80, prev: 10 },
    functions: { diff: 50, next: 70, prev: 20 },
    lines: { diff: 30, next: 60, prev: 30 },
    statements: { diff: 10, next: 50, prev: 40 },
  })
})

it('only returns new thresholds if coverages are above the margin', () => {
  const thresholds = {
    branches: 10,
    functions: 20,
    lines: 30,
    statements: 40,
  }
  const coverages = {
    branches: { pct: 80 },
    functions: { pct: 70 },
    lines: { pct: 60 },
    statements: { pct: 50 },
  }
  const margin = 50
  const tolerance = 0
  const precision = 2

  const newThresholds = getNewThresholds(
    thresholds,
    coverages,
    margin,
    tolerance,
    precision,
  )

  expect(newThresholds).toStrictEqual({
    branches: { diff: 70, next: 80, prev: 10 },
  })
})

it('should return new thresholds if coverage - tolerance is higher than the current threshold', () => {
  const thresholds = {
    branches: 10,
    functions: 20,
    lines: 30,
    statements: 40,
  }
  const coverages = {
    branches: { pct: 80 },
    functions: { pct: 70 },
    lines: { pct: 60 },
    statements: { pct: 50 },
  }
  const margin = 0
  const tolerance = 10
  const precision = 2

  const newThresholds = getNewThresholds(
    thresholds,
    coverages,
    margin,
    tolerance,
    precision,
  )

  expect(newThresholds).toStrictEqual({
    branches: { diff: 60, next: 70, prev: 10 },
    functions: { diff: 40, next: 60, prev: 20 },
    lines: { diff: 20, next: 50, prev: 30 },
  })
})

it('should not return new thresholds if coverage - tolerance is lower than the current threshold', () => {
  const thresholds = {
    branches: 10,
    functions: 20,
    lines: 30,
    statements: 40,
  }
  const coverages = {
    branches: { pct: 80 },
    functions: { pct: 70 },
    lines: { pct: 60 },
    statements: { pct: 50 },
  }
  const margin = 0
  const tolerance = 100
  const precision = 2

  const newThresholds = getNewThresholds(
    thresholds,
    coverages,
    margin,
    tolerance,
    precision,
  )

  expect(newThresholds).toStrictEqual({})
})

it('should return new thresholds with a precision if set', () => {
  const thresholds = {
    branches: 10,
    functions: 20,
    lines: 30,
    statements: 40,
  }
  const coverages = {
    branches: { pct: 80.63 },
    functions: { pct: 70.15 },
    lines: { pct: 60.25 },
    statements: { pct: 50.89 },
  }
  const margin = 0
  const tolerance = 0
  const precision = 1

  const newThresholds = getNewThresholds(
    thresholds,
    coverages,
    margin,
    tolerance,
    precision,
  )

  expect(newThresholds).toStrictEqual({
    branches: { diff: 70.6, next: 80.6, prev: 10 },
    functions: { diff: 50.1, next: 70.1, prev: 20 },
    lines: { diff: 30.2, next: 60.2, prev: 30 },
    statements: { diff: 10.8, next: 50.8, prev: 40 },
  })
})

it('should return new thresholds be a whole number if precision is set to 0', () => {
  const thresholds = {
    branches: 10,
    functions: 20,
    lines: 30,
    statements: 40,
  }
  const coverages = {
    branches: { pct: 80.6 },
    functions: { pct: 70.1 },
    lines: { pct: 60.25 },
    statements: { pct: 50.89 },
  }
  const margin = 0
  const tolerance = 0
  const precision = 0

  const newThresholds = getNewThresholds(
    thresholds,
    coverages,
    margin,
    tolerance,
    precision,
  )

  expect(newThresholds).toStrictEqual({
    branches: { diff: 70, next: 80, prev: 10 },
    functions: { diff: 50, next: 70, prev: 20 },
    lines: { diff: 30, next: 60, prev: 30 },
    statements: { diff: 10, next: 50, prev: 40 },
  })
})
