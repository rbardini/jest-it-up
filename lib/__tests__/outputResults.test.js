require('ansi-colors').enabled = false

const outputResults = require('../outputResults')

const lines = []

jest.spyOn(console, 'log').mockImplementation(message => lines.push(message))

afterEach(() => {
  lines.length = 0
})

it('output results for no changes to coverage thresholds', () => {
  outputResults([])

  expect(lines.join('\n')).toMatchInlineSnapshot(
    `"No changes to coverage thresholds."`,
  )
})

it('output results for updated coverage thresholds', () => {
  outputResults(['threshold → 1', 'threshold → 2', 'threshold → 3'])

  expect(lines.join('\n')).toMatchInlineSnapshot(`
      "Your changes have improved code coverage. Nice work! ❤️
      The following coverage thresholds have been updated:

       threshold → 1
       threshold → 2
       threshold → 3

      Please record the changes to jest.config.js."
    `)
})

it('output results in dry-run mode', () => {
  outputResults(['threshold → 1', 'threshold → 2', 'threshold → 3'], true)

  expect(lines.join('\n')).toMatchInlineSnapshot(`
    "Your changes have improved code coverage. Nice work! ❤️
    The following coverage thresholds can be updated:

     threshold → 1
     threshold → 2
     threshold → 3

    No changes made to jest.config.js. (dry-run mode)"
  `)
})
