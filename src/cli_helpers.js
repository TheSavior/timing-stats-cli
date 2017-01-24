'use strict';

const path = require('path');

const CliHelpers = {
  getTempBenchmarkPath() {
    let tmpPath = process.env.TMP_BENCHMARK_PATH;
    if (!tmpPath) {
      tmpPath = path.join(process.cwd(), 'temp_benchmark_times.txt');
    }

    return tmpPath;
  }
};

module.exports = CliHelpers;
