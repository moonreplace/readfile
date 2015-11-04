/**
 * @file processor.js, 各种processor的基类
 * @author daihuiming(moonreplace@163.com)
 */

var Processor = require('../processor');
var util = require('util');
var levelDb = require('../store/level');
var config = require('../config');

/**
 * 解析相应的perform log
 *
 * @constructor
 * @extends {Stream}
 */
var PerformProcessor = function () {

    Processor.call(this);

    /**
     * 获得当前的url
     *
     * @type {RegExp}
     */
    this.urlRegExp = /GET.+\?(.+?)\s+/;

    /**
     * 获得当前的url到达的时间
     *
     * @type {RegExp}
     */
    this.timeRegExp = /\[(\S+).*\]/;
};

util.inherits(PerformProcessor, Processor);

/**
 * 我们现在得到的是80%的中位置
 */
PerformProcessor.prototype._getSpecialValue = function () {
    var me = this;

    Object.keys(me._data).forEach(function (key) {
        me.sort(me._data[key]['0'], 'da_elapsed');
        // 我们只取80%的中位数
        me.data[key] = me.data[key][0][parseInt(me._data[key]['0'].length * 0.8, 10)];
        console.log(me.data[key]);
    });
    // 清空掉上次的数值
    me._data = {};
    me.emit('data', me.data);
};

/**
 * 排序当前的数据
 *
 * @param {Array<Object>} unorderedArr, 最原始的数组
 * @param {string} key, 要排序的key
 */
PerformProcessor.prototype.sort = function (unorderedArr, key) {
    unorderedArr.sort(function () {
        return unorderedArr[key] - unorderedArr[key];
    });
};


/**
 * 把传入的object中的某些key去掉
 *
 * @param {Object} obj 要去掉的obj
 */
PerformProcessor.prototype.rejectKey = function (obj) {
    var rejectedKeys = config.filter.exceptKeys;

    rejectedKeys.forEach(function (key) {
        if (obj && obj[key]) {
            delete obj[key];
        }
    });
}

/**
 * 有些da_act不能直接用，如perform的一些属性
 *
 * @param {string} name da_act的名称
 * @param {Object} data 要插入的数据
 * @return {string}
 */

PerformProcessor.prototype.mapDbName = function (name, data) {
    var mapDaAct = config.filter.mapDaAct;

    var dbName = mapDaAct[name] || name;

    if (data.time) {
        var time = data.time;
        // 只是得到date
        var date = [time.getFullYear(), time.getMonth() + 1, time.getDate()].join('-');

        // 最后把time放入进来
        dbName = [dbName, date].join('-')
    }

    return dbName;
};

/**
 * 产生数据库里的key
 *
 * @param {string} name da_act的名称
 * @return {string}
 */

PerformProcessor.prototype.generateKey = function (obj) {
    // 遍历当前的object，取得所有的值来最终生成key
    // 对perform相关的选项进行特殊处理
    var values = [];

    config.filter.filterKeys.forEach(function (key) {
        if (obj[key]) {
            values.push(obj[key]);
        }
    });

    if (obj.time) {
        var time = obj.time;
        values.push([obj.time.getHours(), obj.time.getMinutes()].join('-'));
    }

    return values.join(config.db.keySep);
};

/**
 * 根据不同的db来做不同的策略处理
 *
 * @param {Object} db 我们要插入的数据库
 * @param {Object} obj 要插入的数据
 */
PerformProcessor.prototype.insert = function (db, obj) {
    var me = this;
    var key = me.generateKey(obj);
    db.push(key, obj)
};

/**
 * 对得到的数据进行处理
 *
 * @param {Array} data, 得到的所有数据
 */
PerformProcessor.prototype.process = function (data) {
    var me = this;

    for (var i = data.length - 1; i >= 0; i--) {
        // 根据规则我们把得到的数据解析成一个object
        var parsedData = me.parseUrl(data[i]);

        if (parsedData && parsedData.da_act) {
            // 去除掉不需要的key
            me.rejectKey(parsedData);
            // 产生不同的数据库
            var mappedDbName = me.mapDbName(parsedData.da_act, parsedData);

            var db = levelDb.get(mappedDbName);
            me.insert(db, parsedData);
        }
        else {
            console.log(data[i]);
        }

        /*var stream = db.createReadStream({});
        stream.on('data', function (data) {
            console.log(data.key);
            console.log(data.value);
        });*/
    };

};

/**
 * 把string转为object
 *
 * @param {string} data, 要转化为的obj的源数据
 * @return {Object}
 */
PerformProcessor.prototype.parseUrl = function (data) {
    var result = {};
    var me = this;
    try {
        var time = me.timeRegExp.exec(data);
        // 现在有23/Aug/2015:01:01:34, 发现有年和分之间多了个:号
        var normalTime = time[1].replace(/:/, function () {
            return ' ';
        });
        result.time = new Date(normalTime); // 得到当前的时间戳

        var urls = me.urlRegExp.exec(data);
        if (urls && urls[1]) {
            var params = urls[1].split('&'); // 得到所有的参数
            params.forEach(function (param) {
                var values = param.split('=');
                // 如果是空值，我们就不会加入到当前的数据中
                if (values[1]) {
                    result[values[0]] = values[1];
                }
            });
        }
        return result;
    }
    catch (ex) {
        console.log(ex);
    }
};

module.exports = PerformProcessor;
