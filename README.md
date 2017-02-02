timing-stats-cli
=================
Instrument your build / deployment process to be able to monitor and investigate improvements using [https://github.com/TheSavior/timing-stats].

# Installation

via [npm (node package manager)](https://github.com/npm/npm)

    $ npm install timing-stats-cli --save-dev

via [yarn](https://github.com/yarnpkg/yarn)

    $ yarn add timing-stats-cli --dev

# Usage
This library provides two command line utilities to help instrument your build.

## `benchmark`
`benchmark` is used to time a command.

```
benchmark YOUR-STAGE-NAME COMMAND
```

examples:
```bash
benchmark linters "eslint && rubocop"
benchmark tests mocha
```

This writes to a temporary file the start and end timestamps for the given subcommand.

## `add-temp-timing-to-json`
At the end of your build or deployment process when all of the commands have been benchmarked, run `add-temp-timing-to-json` to calculate the length of time for each stage and append the results to an existing JSON file. Pass as an argument the path to the json file it should append to.

example:
```
add-temp-timing-to-json build_times.json
```

`add-temp-timing-to-json` uses environment variables to know how to separate each build. If you use travis, this is done automatically by using `TRAVIS_BUILD_NUMBER`. Otherwise you will need to set `BUILD_IDENTIFIER`
