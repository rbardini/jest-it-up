require('ansi-colors').enabled = false

const outputChanges = require('../outputChanges')

const lines = []

jest.spyOn(console, 'log').mockImplementation(message => lines.push(message))

afterEach(() => {
  lines.length = 0
})

it('output results for no changes to coverage thresholds', () => {
  outputChanges([])

  expect(lines.join('\n')).toMatchInlineSnapshot(
    `"No changes to coverage thresholds."`,
  )
})

it('output results for updated coverage thresholds', () => {
  outputChanges(['threshold → 1', 'threshold → 2', 'threshold → 3'])

  expect(lines.join('\n')).toMatchInlineSnapshot(`
    "Your changes have improved code coverage. Nice work! ❤️
    The following coverage thresholds will be updated:

     threshold → 1
     threshold → 2
     threshold → 3
    "
  `)
})

it('output results in dry-run mode', () => {
  outputChanges(['threshold → 1', 'threshold → 2', 'threshold → 3'], true)

  expect(lines.join('\n')).toMatchInlineSnapshot(`
    "Your changes have improved code coverage. Nice work! ❤️
    The following coverage thresholds can be updated:

     threshold → 1
     threshold → 2
     threshold → 3
    "
  `)
})
