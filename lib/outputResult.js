const { yellow } = require('ansi-colors')

const outputResult = (configPath, dryRun) => {
  console.log(
    dryRun
      ? `No changes made to ${yellow(configPath)}. (dry-run mode)`
      : `Done! Please record the changes to ${yellow(configPath)}.`,
  )
}

module.exports = outputResult
