const getNewThresholds = (thresholds, coverages, margin) =>
  Object.entries(thresholds).reduce((acc, [type, threshold]) => {
    const { pct: coverage } = coverages[type]

    // Only update threshold if new coverage is higher than
    // current threshold + margin
    if (coverage >= threshold + margin) {
      acc[type] = {
        prev: threshold,
        next: coverage,
        diff: +(coverage - threshold).toFixed(2),
      }
    }

    return acc
  }, {})

module.exports = getNewThresholds
