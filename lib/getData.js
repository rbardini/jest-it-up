const fs = require('fs')
const path = require('path')

const getData = async configPath => {
  const config = require(configPath)
  const {
    coverageThreshold: { global: thresholds },
    coverageDirectory = 'coverage',
  } = typeof config === 'function' ? await config() : config
  const reportPath = path.resolve(
    process.cwd(),
    coverageDirectory,
    'coverage-summary.json',
  )
  const { total: coverages } = JSON.parse(fs.readFileSync(reportPath, 'utf8'))

  return { thresholds, coverages }
}

module.exports = getData
