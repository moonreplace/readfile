/**
 * @file index.js handlers的主入口文件
 * @author daihuiming(moonreplace@163.com)
 */
var glob = require('glob');
var path = require('path');

glob('**/*.js', {cwd: __dirname}, function (err, files) {

    files.forEach(function (file) {
        var pathName = path.dirname(file);
        var fileName = path.basename(file, '.js');

        if (pathName !== '.') {
            module.exports[pathName] = require(['.', path.join(pathName,fileName)].join(path.sep));
        }
        else {
            if (fileName !== 'index') {
                module.exports[fileName] = require(['.', fileName].join(path.sep));
            }
        }
    });
});
