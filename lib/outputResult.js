const { yellow } = require('ansi-colors')

const outputResult = dryRun => {
  console.log(
    dryRun
      ? `No changes made to ${yellow('jest.config.js')}. (dry-run mode)`
      : `Done! Please record the changes to ${yellow('jest.config.js')}.`,
  )
}

module.exports = outputResult
