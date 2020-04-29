#!/usr/bin/env node
const path = require('path')

const applyChanges = require('./applyChanges')
const getChanges = require('./getChanges')
const getData = require('./getData')
const getNewThresholds = require('./getNewThresholds')
const outputResults = require('./outputResults')

module.exports = ({ dryRun = false, margin = 0 } = {}) => {
  const workingDir = process.cwd()
  const configPath = path.resolve(workingDir, 'jest.config.js')
  const reportPath = path.resolve(workingDir, 'coverage/coverage-summary.json')

  const { thresholds, coverages } = getData(configPath, reportPath)
  const newThresholds = getNewThresholds(thresholds, coverages, margin)
  const { changes, data } = getChanges(configPath, newThresholds)

  if (!dryRun) {
    applyChanges(configPath, changes, data)
  }

  outputResults(changes, dryRun)
}
