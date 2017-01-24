'use strict';

const assert = require('chai').assert;
const fs = require('fs');
const exec = require('child_process').exec;
const path = require('path');

describe('benchmark', (done) => {
  let tempPath;

  function runCommand(command, callback) {
    const exists = fs.existsSync(tempPath);
    assert.isFalse(exists);

    exec(path.resolve(__dirname, `../bin/benchmark name ${command}`), {
      env: Object.assign({}, process.env, {
        TMP_BENCHMARK_PATH: tempPath
      })
    }, callback);
  }

  function validateOutputStructure() {
    const afterContents = fs.readFileSync(tempPath, {
      encoding: 'utf-8'
    }).trim().split('\n');

    assert.strictEqual(2, afterContents.length);
    assert.strictEqual('START', afterContents[0].split('::')[0]);
    assert.strictEqual('name', afterContents[0].split('::')[1]);
    assert.strictEqual('STOP', afterContents[1].split('::')[0]);
    assert.strictEqual('name', afterContents[1].split('::')[1]);
  }

  beforeEach(() => {
    const tmpDir = fs.mkdtempSync('/tmp' + path.sep);
    tempPath = path.join(tmpDir, 'benchmark_test.txt');
  });

  it('should append to txt and run command', (done) => {
    const exists = fs.existsSync(tempPath);
    assert.isFalse(exists);

    runCommand('echo "foo bar"', (error, stdout, stderr) => {
      if (error) {
        throw error;
        return;
      }

      assert.strictEqual(stdout.trim(), 'foo bar');

      validateOutputStructure();
      done();
    });
  });

  it('should support failure commands', (done) => {
    const exists = fs.existsSync(tempPath);
    assert.isFalse(exists);

    runCommand('echo "blah" && exit 15', (error, stdout, stderr) => {
      assert.strictEqual(error.code, 15);

      assert.strictEqual(stdout.trim(), 'blah');

      validateOutputStructure();
      done();
    });
  });
});
