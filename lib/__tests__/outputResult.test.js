require('ansi-colors').enabled = false

const outputResult = require('../outputResult')

const lines = []

jest.spyOn(console, 'log').mockImplementation(message => lines.push(message))

afterEach(() => {
  lines.length = 0
})

it('output results for updated coverage thresholds', () => {
  outputResult(false)

  expect(lines.join('\n')).toMatchInlineSnapshot(
    `"Done! Please record the changes to jest.config.js."`,
  )
})

it('output results in dry-run mode', () => {
  outputResult(true)

  expect(lines.join('\n')).toMatchInlineSnapshot(
    `"No changes made to jest.config.js. (dry-run mode)"`,
  )
})
