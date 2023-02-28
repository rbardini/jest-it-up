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

  const newThresholds = getNewThresholds(
    thresholds,
    coverages,
    margin,
    tolerance,
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

  const newThresholds = getNewThresholds(
    thresholds,
    coverages,
    margin,
    tolerance,
  )

  expect(newThresholds).toStrictEqual({
    branches: { diff: 70, next: 80, prev: 10 },
    functions: { diff: 50, next: 70, prev: 20 },
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

  const newThresholds = getNewThresholds(
    thresholds,
    coverages,
    margin,
    tolerance,
  )

  expect(newThresholds).toStrictEqual({
    branches: { diff: 60, next: 70, prev: 10 },
    functions: { diff: 40, next: 60, prev: 20 },
    lines: { diff: 20, next: 50, prev: 30 },
    statements: { diff: 0, next: 40, prev: 40 },
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

  const newThresholds = getNewThresholds(
    thresholds,
    coverages,
    margin,
    tolerance,
  )

  expect(newThresholds).toStrictEqual({})
})
