const fs = require('fs')

const getData = (configPath, reportPath) => {
  const {
    coverageThreshold: { global: thresholds },
  } = require(configPath)
  const { total: coverages } = JSON.parse(fs.readFileSync(reportPath, 'utf8'))

  return { thresholds, coverages }
}

module.exports = getData
