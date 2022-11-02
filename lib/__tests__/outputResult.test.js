require('ansi-colors').enabled = false

const outputResult = require('../outputResult')

const configPath = './jest.config.js'
const lines = []

jest.spyOn(console, 'log').mockImplementation(message => lines.push(message))

afterEach(() => {
  lines.length = 0
})

it('output results for updated coverage thresholds', () => {
  outputResult(configPath, false)

  expect(lines.join('\n')).toMatchInlineSnapshot(
    `"Done! Please record the changes to ${configPath}."`,
  )
})

it('output results in dry-run mode', () => {
  outputResult(configPath, true)

  expect(lines.join('\n')).toMatchInlineSnapshot(
    `"No changes made to ${configPath}. (dry-run mode)"`,
  )
})
