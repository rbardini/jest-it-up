const { yellow } = require('ansi-colors')

const outputResults = (changes, dryRun) => {
  if (changes.length === 0) {
    console.log('No changes to coverage thresholds.')
    return
  }

  console.log('Your changes have improved code coverage. Nice work! ❤️')
  console.log(
    dryRun
      ? 'The following coverage thresholds can be updated:'
      : 'The following coverage thresholds have been updated:',
  )

  console.log()
  changes.forEach(change => console.log(` ${change}`))
  console.log()

  console.log(
    dryRun
      ? `No changes made to ${yellow('jest.config.js')}. (dry-run mode)`
      : `Please record the changes to ${yellow('jest.config.js')}.`,
  )
}

module.exports = outputResults
