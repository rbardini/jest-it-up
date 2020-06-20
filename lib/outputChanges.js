const outputChanges = (changes, dryRun) => {
  if (changes.length === 0) {
    console.log('No changes to coverage thresholds.')
    return
  }

  console.log('Your changes have improved code coverage. Nice work! ❤️')
  console.log(
    dryRun
      ? 'The following coverage thresholds can be updated:'
      : 'The following coverage thresholds will be updated:',
  )

  console.log()
  changes.forEach(change => console.log(` ${change}`))
  console.log()
}

module.exports = outputChanges
