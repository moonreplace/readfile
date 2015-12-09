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
    app.get(/^\/api\/(.+?)\/(.+?)\/(.+?)$/, function (req, res, item, page, time) {

        var dbPrefix = '';

        switch (item) {
            case 'pv':
                dbPrefix = 'ready';
                break;
            case 'click':
                dbPrefix = 'click';
                break;
            case 'perform':
                dbPrefix = 'perform';
                break;
            default:
                dbPrefix = item;
        }
        // 得到当前的数据库名
        var dbName = [dbPrefix, time].join('-');
        var filter = {};
        
        if (page !== 'all') {
            filter = {
                // gte: [page, 'ios', '00-00'].join('-'),
                gte: page,
                lte: String.fromCharCode(page.charCodeAt(0) + 1)
            };
        }

        var db = levelDb.get(dbName);

        var result = [];

        var dbStream = db.createReadStream(filter);

        res.writeHead(200, {"Content-Type": "application/json"}); 
        res.write('[');
        //dbStream.pipe(res);
            dbStream.on('data', function (data) {
                var tempValue = {};

                if (dbPrefix === 'perform') {
                    var temp = {};
                    data.value.forEach(function (item) {
                        if (item.da_act === 'perform' && item.da_attr) {
                            if (!temp[item.da_attr]) {
                                temp[item.da_attr] = [];
                                temp[item.da_attr].push(item);
                            }
                            else {
                                temp[item.da_attr].push(item);
                            }
                        }
                    });

                    Object.keys(temp).forEach(function (key) {
                        temp[key].sort(function (a, b) {
                            return a.da_elapsed > b.da_elapsed;
                        });

                        // 取80%的中位数
                        var length = temp[key].length;
                        var index = Math.floor(length * 0.8);
                        temp[key] = temp[key][index] || {};                        
                        temp[key].length = length;
                    });
                    tempValue[data.key] = temp;
                } else {

                    if (dbPrefix === 'error') {
                        tempValue[data.key] = data.value; 
                    }
                    else {
                        tempValue[data.key] = data.value.length;
                    }
                }

                res.write(JSON.stringify(tempValue));

            })
            .on('error', function (err) {
                console.log('Oh my!', err)
            })
            .on('close', function () {
                console.log('Stream closed')
            })
            .on('end', function () {

                res.end(']');
                console.log('Stream closed')
            });
    });

    // 静态文件
    app.get(/^\/assets\/(.+)/, nodeRouter.staticDirHandler('public/'));


    app.listen(config.server.web.port);
};

exports.start();
