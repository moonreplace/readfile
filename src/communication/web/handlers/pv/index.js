module.exports = function (req, res, page, time) {
    // 得到当前的数据库名
    var dbName = ['ready', time].join('-');

    var db = levelDb.get(dbName);

    var result = {
        Android: [],
        ios: [],
        others: []
    };

    var filter = {
        gte: page,
        lte: String.fromCharCode(page.charCodeAt(0) + 1)
    };

    db.createReadStream()
        .on('data', function (data) {
            var temp = {};
            temp[data.key] = data.value.length;
            if (data.key.indexOf('Android') > -1) {
                result.Android.push(temp);
            }
            else if (data.key.indexOf('ios') > -1) {
                result.ios.push(temp);
            }
            else {
                result.others.push(temp);
            }
        })
        .on('error', function (err) {
            console.log('Oh my!', err)
        })
        .on('close', function () {
            console.log('Stream closed')
        })
        .on('end', function () {

            res.simpleJson(200, result);

            console.log('Stream closed')
        });
};
