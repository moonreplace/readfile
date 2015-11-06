/**
 * @file server.js 用来取数据
 * @author daihuiming(moonreplace@163.com)
 */
var nodeRouter = require('./node-router');
var server = nodeRouter.getServer();
var config = require('../../config');
var levelDb = require('../../store/level');

exports.start = function () {
    //api 数据
    server.get(/^\/api\/pv\/(.+?)\/(.+?)$/, function (req, res, page, time) {
        // 得到当前的数据库名
        var dbName = ['ready', time].join('-');

        var db = levelDb.get(dbName);

        db.createReadStream()
            .on('data', function (data) {
                console.log(data.key, '=', data.value)
            })
            .on('error', function (err) {
                console.log('Oh my!', err)
            })
            .on('close', function () {
                console.log('Stream closed')
            })
            .on('end', function () {
                console.log('Stream closed')
            });
    });

    //

    // 静态文件
    server.get(/^\/assets\/(.+)/, nodeRouter.staticDirHandler('public/'));


    server.listen(config.server.web.port);
};
