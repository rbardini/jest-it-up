const fs = require('fs')
const { styleText } = require('node:util')

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
          `${type.padEnd(12)}${styleText('dim', String(prev))} → ${next} ${styleText(
            'green',
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
