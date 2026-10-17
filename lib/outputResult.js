const { styleText } = require('node:util')

const outputResult = (configPath, dryRun) => {
  console.log(
    dryRun
      ? `No changes made to ${styleText('yellow', configPath)}. (dry-run mode)`
      : `Done! Please record the changes to ${styleText('yellow', configPath)}.`,
  )
}

module.exports = outputResult
