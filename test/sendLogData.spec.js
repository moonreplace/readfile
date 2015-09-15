var sendLogData = require('../sendLogData');

var exec = require('child_process').exec;
var cmdStr = 'cat test/input.txt >> test/access_log.txt';

describe('测试高速环境下的性能', function () {
    it('测试每秒钟1000条记录', function () {
        setInterval(function () {
            exec(cmdStr, function (err, stdout, stderr) {
                if (err) {
                    console.log(err);
                }
            });
        }, 10);
    });
});
