'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const cliHelpers = require('../src/cli_helpers');

describe('cliHelpers', () => {
  describe('getTempBenchmarkPath', () => {
    let originalPath;

    beforeEach(() => {
      originalPath = process.env.TMP_BENCHMARK_PATH;
      delete process.env.TMP_BENCHMARK_PATH;
    });

    afterEach(() => {
      process.env.TMP_BENCHMARK_PATH = originalPath;
    });

    it('should return the env variable if exists', () => {
      process.env.TMP_BENCHMARK_PATH = '/foo/bar.txt';

      assert.strictEqual('/foo/bar.txt', cliHelpers.getTempBenchmarkPath());
    });

    it('should return a static file if env var is not set', () => {
      sinon.stub(process, 'cwd').returns('/blah/boo');

      assert.strictEqual('/blah/boo/temp_benchmark_times.txt', cliHelpers.getTempBenchmarkPath());

      sinon.restore(process.cwd);
    });
  });
});
