const getNewThresholds = (
  thresholds,
  coverages,
  margin,
  tolerance,
  precision,
) =>
  Object.entries(thresholds).reduce((acc, [type, threshold]) => {
    const { pct: coverage } = coverages[type]

    const desiredCoverage = coverage - tolerance
    const factor = Math.pow(10, precision)
    const nextCoverage = Math.trunc(desiredCoverage * factor) / factor

    // Only update threshold if new coverage is higher than
    // current threshold + margin
    if (nextCoverage > threshold + margin) {
      acc[type] = {
        prev: threshold,
        next: nextCoverage,
        diff: +(nextCoverage - threshold).toFixed(2),
      }
    }

    return acc
  }, {})

module.exports = getNewThresholds
