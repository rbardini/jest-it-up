# jest-it-up

[![npm package version](https://img.shields.io/npm/v/jest-it-up)](https://www.npmjs.com/package/jest-it-up)
[![Build status](https://img.shields.io/github/workflow/status/rbardini/jest-it-up/Main)](https://github.com/rbardini/jest-it-up/actions)
[![Code coverage](https://img.shields.io/codecov/c/github/rbardini/jest-it-up.svg)](https://codecov.io/gh/rbardini/jest-it-up)
[![Dependencies status](https://img.shields.io/librariesio/release/npm/jest-it-up)](https://libraries.io/npm/jest-it-up)

Ensure incremental coverage gains are not lost, and positively reinforce good testing habits. Automatically bump up global Jest thresholds whenever coverage goes above them.

![Demo](demo.gif)

## Requirements

- Node.js 12+
- Conventional `jest.config.js` (`package.json` config unsupported)
- `json-summary` coverage report (see [usage](#usage))

## Installation

```console
npm install --save-dev jest-it-up
```

## Usage

jest-it-up exposes a standalone CLI tool (see [options](#options)), but you most likelly want to use it in a post-test script.

Within `package.json`:

```js
{
  "scripts": {
    "test": "jest --coverage", // or set `collectCoverage` to `true` in Jest config
    "posttest": "jest-it-up" // must run from the same directory as `jest.config.js`
  }
}
```

within `jest.config.js`:

```js
module.exports = {
  coverageReporters: [
    'json-summary' // plus any other reporters, e.g. "lcov", "text", "text-summary"
  ],
  coverageThreshold: {
    global: {
      branches: 0, // or your current numbers
      functions: 0,
      lines: 0,
      statements: 0
    },
    './src/**/*.module.ts': { // coverage key with pattern
      branches: 50, // or your current numbers for the patterned threshold key
      functions: 50,
      lines: 50,
      statements: 50
    }
  }
}
```

Once tests finish running, jest-it-up will update configured thresholds to match higher coverage numbers, if any.

## Options

```console
$ jest-it-up --help
Usage: jest-it-up [options]

Options:
  -c, --config <path>          path to a Jest config file (default: 'jest.config.js')
  -m, --margin <margin>        minimum threshold increase (default: 0)
  -t, --tolerance <tolerance>  threshold difference from actual coverage
  -k, --thresholdKeys <keys>   comma-separated list of threshold keys to consider (default: 'global')
  -i, --interactive            ask for confirmation before applying changes
  -s, --silent                 do not output messages
  -d, --dry-run                process but do not change files
  -v, --version                output the version number
  -h, --help                   display help for command
```

jest-it-up only considers the `global` threshold key by default. To update custom threshold keys, you can use the `--thresholdKeys` option when running the script. For example, to update the `global` and `./src/**/*.module.ts` threshold keys, you can run:

```console
$ jest-it-up --thresholdKeys global,"./src/**/*.module.ts"
```
This will update the specified threshold keys (global and custom) and leave others unchanged.
