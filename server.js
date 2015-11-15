/**
 * @file server.js 用来取数据
 * @author daihuiming(moonreplace@163.com)
 */
var nodeRouter = require('./src/communication/web/node-router');
var app = nodeRouter.getServer();
var config = require('./src/config');
var levelDb = require('./src/store/level');

exports.start = function () {

    //api 数据
    app.get(/^\/api\/pv\/(.+?)\/(.+?)$/, function (req, res, page, time) {
        // 得到当前的数据库名
        var dbName = ['ready', time].join('-');

        var a = {
            // gte: [page, 'ios', '00-00'].join('-'),
            gte: page,
            lte: 's'
        };

        var db = levelDb.get(dbName);

        var result = [];

        db.createReadStream(a)
            .on('data', function (data) {
                var temp = {};
                temp[data.key] = data.value.length;
                result.push(temp);
            })
            .on('error', function (err) {
                console.log('Oh my!', err)
            })
            .on('close', function () {
                console.log('Stream closed')
            })
            .on('end', function () {

                var data =

                res.simpleJson(200, result);

                console.log('Stream closed')
            });
    });

    //

    // 静态文件
    app.get(/^\/assets\/(.+)/, nodeRouter.staticDirHandler('public/'));


    app.listen(config.server.web.port);
};

exports.start();
