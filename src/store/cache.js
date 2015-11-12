/**
 * @file cache.js, 设定内存cache
 * @author daihuiming(moonreplace@163.com)
 */

module.exports = Cache;

var _ = require('lodash');
var util = require('util');

function Cache() {

    if (!(this instanceof Cache)) {
        return new Cache();
    }

    this._items = {};

    this._maxMinute = 2;
};

/**
 * 把内容合并到相应的key中
 *
 * @param {string} key
 * @param {Object} item
 */
Cache.prototype.add = function (key, item) {

    if (!this._items[key]) {
        this._items[key] = item;
    }
    else {
        var me = this;

        Object.keys(item).forEach(function (subKey) {
            // 如果当前已经有值存在，
            if (me._items[key][subKey]) {
                me._items[key][subKey] = me._items[key][subKey].concat(item[subKey]);
            }
            else {
                me._items[key][subKey] = item[subKey];
            }
        });
    }
};

/**
 * 只有同一个Key超过3个值的时候，我们取出最早放进来的
 */
Cache.prototype.get = function (key) {
    var result = {};
    result[key] = {};
    var me = this;

    var existItem = me._items[key];

    var current = new Date(Date.now() - me._maxMinute * 60 * 1000);

    var currentMonth = current.getMonth() + 1;
    var currentDay = current.getDate();
    var currentMinute = current.getMinutes();
    var currentHour = current.getHours();

    var timeKey = [currentHour, currentMinute].join('-');

    // 到第二天的时候，把前面的数据库关掉
    if (currentHour === 0 && currentMinute > me._maxMinute) {
        var dateKey = [currentMonth, currentDay].join('-');
        Object.keys(me._items).forEach(function (subKey) {
            if (subKey.indexOf(dateKey) > -1) {
                result[subKey] = _.clone(me._items[subKey], true);

                delete me._items[subKey];
            }
        });
    }

    if (existItem) {
        Object.keys(existItem).forEach(function (subKey) {
            if (subKey.indexOf(timeKey) > -1) {
                result[key][subKey] = _.clone(existItem[subKey], true);
                delete existItem[subKey];
            }
        });
    }

    return result;
};

