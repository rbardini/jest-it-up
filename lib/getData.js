const fs = require('fs')
const path = require('path')

const getData = async (configPath, thresholdKeys = ['global']) => {
  const config = require(configPath)
  const { coverageThreshold, coverageDirectory = 'coverage' } =
    typeof config === 'function' ? await config() : config

  const thresholds = thresholdKeys.reduce((acc, key) => {
    acc[key] = coverageThreshold[key]
    return acc
  }, {})

  const reportPath = path.resolve(
    path.dirname(configPath),
    coverageDirectory,
    'coverage-summary.json',
  )
  const { total: coverages } = JSON.parse(fs.readFileSync(reportPath, 'utf8'))

  return { thresholds, coverages }
}

module.exports = getData
