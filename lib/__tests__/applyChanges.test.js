const fs = require('fs')

const applyChanges = require('../applyChanges')

const configPath = './jest.config.js'
const data = 'data'

jest.mock('fs')

it('does not write config file if there are no changes', () => {
  const changes = []

  applyChanges(configPath, changes, data)

  expect(fs.writeFileSync).not.toHaveBeenCalled()
})

it('writes config file if there are changes', () => {
  const changes = ['threshold → 1', 'threshold → 2', 'threshold → 3']

  applyChanges(configPath, changes, data)

  expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
  expect(fs.writeFileSync).toHaveBeenCalledWith(configPath, data)
})
