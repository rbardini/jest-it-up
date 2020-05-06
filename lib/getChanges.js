const fs = require('fs')
const { dim, green } = require('ansi-colors')

const getChanges = (configPath, newThresholds) =>
  Object.entries(newThresholds).reduce(
    (acc, [type, { prev, next, diff }]) => {
      const newData = acc.data.replace(
        new RegExp(
          `(?<=coverageThreshold:.+?global:.+?${type}:\\s*)\\d*\\.?\\d+`,
          's',
        ),
        next,
      )

      if (acc.data !== newData) {
        acc.data = newData

        acc.changes.push(
          `${type.padEnd(12)}${dim(prev)} → ${next} ${green(
            `+${diff}`.padStart(6),
          )}`,
        )
      }

      return acc
    },
    {
      data: fs.readFileSync(configPath, 'utf8'),
      changes: [],
    },
  )

module.exports = getChanges
