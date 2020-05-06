#!/usr/bin/env node
const path = require('path')
const confirm = require('@inquirer/confirm')

const applyChanges = require('./applyChanges')
const getChanges = require('./getChanges')
const getData = require('./getData')
const getNewThresholds = require('./getNewThresholds')
const outputChanges = require('./outputChanges')
const outputResult = require('./outputResult')

module.exports = async ({
  dryRun = false,
  interactive = false,
  margin = 0,
  silent = false,
} = {}) => {
  const workingDir = process.cwd()
  const configPath = path.resolve(workingDir, 'jest.config.js')
  const reportPath = path.resolve(workingDir, 'coverage/coverage-summary.json')

  const { thresholds, coverages } = getData(configPath, reportPath)
  const newThresholds = getNewThresholds(thresholds, coverages, margin)
  const { changes, data } = getChanges(configPath, newThresholds)

  if (!silent) {
    outputChanges(changes, dryRun)
  }

  const hasChanges = changes.length > 0

  if (!hasChanges) {
    return
  }

  const confirmed =
    !interactive || (await confirm({ message: 'Update thresholds?' }))

  if (!confirmed) {
    return
  }

  if (!dryRun) {
    applyChanges(configPath, data)
  }

  outputResult(dryRun)
}
