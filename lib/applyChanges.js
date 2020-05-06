const fs = require('fs')

const applyChanges = (configPath, data) => {
  fs.writeFileSync(configPath, data)
}

module.exports = applyChanges
