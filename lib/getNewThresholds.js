const getNewThresholds = (thresholds, coverages, margin, tolerance) =>
  Object.entries(thresholds).reduce((acc, [key, nestedThresholds]) => {
    acc[key] = Object.entries(nestedThresholds).reduce(
      (nestedAcc, [type, threshold]) => {
        const { pct: coverage } = coverages[type]

        const desiredCoverage = coverage - tolerance

        // Only update threshold if new coverage is higher than
        // current threshold + margin
        if (desiredCoverage >= threshold + margin) {
          nestedAcc[type] = {
            prev: threshold,
            next: desiredCoverage,
            diff: +(desiredCoverage - threshold).toFixed(2),
          }
        }

        return nestedAcc
      },
      {},
    )

    return acc
  }, {})

module.exports = getNewThresholds
