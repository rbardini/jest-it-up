const fs = require('fs')

const applyChanges = require('../applyChanges')

const configPath = './jest.config.js'
const data = 'data'

jest.mock('fs')

it('writes config file', () => {
  applyChanges(configPath, data)

  expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
  expect(fs.writeFileSync).toHaveBeenCalledWith(configPath, data)
})
