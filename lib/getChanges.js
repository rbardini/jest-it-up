const fs = require('fs')
const { dim, green } = require('ansi-colors')

const getChanges = (configPath, newThresholds) =>
  Object.entries(newThresholds).reduce(
    (acc, [key, newValues]) => {
      const isNewKey = key !== 'global'
      const thresholdKey = isNewKey
        ? `'${key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}'`
        : key
      const keyPrefix = isNewKey ? `^\\s*` : ''

      Object.entries(newValues).forEach(([type, { prev, next, diff }]) => {
        const regex = new RegExp(
          `(?<=${keyPrefix}${thresholdKey}:\\s*{[^}]*${type}:\\s*)\\d*\\.?\\d+(?=,\\s*\\n\\s*${
            type === 'statements' ? '}' : ''
          })`,
          'ms',
        )

        const newData = acc.data.replace(regex, next)

        if (acc.data !== newData) {
          acc.data = newData

          acc.changes.push(
            `${key} ${type.padEnd(12)}${dim(prev)} → ${next} ${green(
              `+${diff}`.padStart(6),
            )}`,
          )
        }
      })

      return acc
    },
    {
      data: fs.readFileSync(configPath, 'utf8'),
      changes: [],
    },
  )

module.exports = getChanges
