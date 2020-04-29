const fs = require('fs')

const applyChanges = (configPath, changes, data) => {
  if (changes.length === 0) {
    return
  }

  fs.writeFileSync(configPath, data)
}

module.exports = applyChanges
