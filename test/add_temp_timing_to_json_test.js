'use strict';

const assert = require('chai').assert;
const exec = require('child_process').exec;
const fs = require('fs');
const sinon = require('sinon');
const path = require('path');
const cliHelpers = require('../src/cli_helpers');

const benchmarkPath = path.join(process.cwd(), 'fake_benchmark.txt');;
const jsonPath = path.join(process.cwd(), 'fake_json.json');

describe('add-temp-timing-to-json', () => {
  afterEach(() => {
    fs.unlinkSync(benchmarkPath);
    fs.unlinkSync(jsonPath);
  });

  it('should write nonexistent json file', (done) => {
    fs.writeFileSync(benchmarkPath, `START::foo::1000
STOP::foo::1020
START::bar::1010
STOP::bar::1030`);

    const expected = [{
      "id": 13,
      "stages": [
        {
          "stage": "foo",
          "start": 1000,
          "end": 1020
        },
        {
          "stage": "bar",
          "start": 1010,
          "end": 1030
        }
      ]
    }];

    const exists = fs.existsSync(jsonPath);
    assert.isFalse(exists);

    exec(path.resolve(__dirname, `../bin/add-temp-timing-to-json ${jsonPath}`), {
      env: Object.assign({
        TRAVIS_BUILD_NUMBER: 13,
        TMP_BENCHMARK_PATH: benchmarkPath
      }, process.env)
    }, (error, stdout, stderr) => {
      const jsonContents = JSON.parse(fs.readFileSync(jsonPath));
      assert.deepEqual(jsonContents, expected);
      done();
    });
  });

  it('should append to existing json file', (done) => {
    const initial = [{
      "id": 13,
      "stages": [
        {
          "stage": "foo",
          "start": 1000,
          "end": 1020
        },
        {
          "stage": "bar",
          "start": 1010,
          "end": 1030
        }
      ]
    }];

    fs.writeFileSync(jsonPath, JSON.stringify(initial));

    fs.writeFileSync(benchmarkPath, `START::foo2::2000
STOP::foo2::2020
START::bar2::2010
STOP::bar2::2030`);

    initial.push({
      "id": 15,
      "stages": [
        {
          "stage": "foo2",
          "start": 2000,
          "end": 2020
        },
        {
          "stage": "bar2",
          "start": 2010,
          "end": 2030
        }
      ]
    });

    const exists = fs.existsSync(jsonPath);
    assert.isTrue(exists);

    exec(path.resolve(__dirname, `../bin/add-temp-timing-to-json ${jsonPath}`), {
      env: Object.assign({
        TRAVIS_BUILD_NUMBER: 15,
        TMP_BENCHMARK_PATH: benchmarkPath
      }, process.env)
    }, (error, stdout, stderr) => {
      const jsonContents = JSON.parse(fs.readFileSync(jsonPath));
      assert.deepEqual(jsonContents, initial);
      done();
    });
  });
});
