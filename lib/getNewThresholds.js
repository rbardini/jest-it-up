const getNewThresholds = (thresholds, coverages, margin, tolerance, wholeNumber) =>
  Object.entries(thresholds).reduce((acc, [type, threshold]) => {
    const { pct: coverage } = coverages[type]

    const desiredCoverage = coverage - tolerance

    // Only update threshold if new coverage is higher than
    // current threshold + margin
    if (desiredCoverage >= threshold + margin) {
      acc[type] = {
        prev: threshold,
        next: wholeNumber ? Math.floor(desiredCoverage) : desiredCoverage,
        diff: +(desiredCoverage - threshold).toFixed(2),
      }
    }

    return acc
  }, {})

module.exports = getNewThresholds
