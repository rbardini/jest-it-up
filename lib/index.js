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
  config = false,
  dryRun = false,
  interactive = false,
  margin = 0,
  silent = false,
} = {}) => {
  const configPath = config
    ? path.resolve(process.cwd(), config)
    : path.resolve(process.cwd(), 'jest.config.js')

  const { thresholds, coverages } = await getData(configPath)
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

  outputResult(configPath, dryRun)
}
