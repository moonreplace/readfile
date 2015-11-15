/**
 * @file cache.js, 设定内存cache
 * @author daihuiming(moonreplace@163.com)
 */

module.exports = Cache;

var _ = require('lodash');
var util = require('util');
var appUtil = require('../util');

function Cache() {

    if (!(this instanceof Cache)) {
        return new Cache();
    }

    this.items = {};

    this._maxMinute = 2;
};

/**
 * 把内容合并到相应的key中
 *
 * @param {string} key
 * @param {Object} item
 */
Cache.prototype.add = function (key, item) {

    if (!this.items[key]) {
        this.items[key] = item;
    }
    else {
        var me = this;

        Object.keys(item).forEach(function (subKey) {
            // 如果当前已经有值存在，
            if (me.items[key][subKey]) {
                me.items[key][subKey] = me.items[key][subKey].concat(item[subKey]);
            }
            else {
                me.items[key][subKey] = item[subKey];
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

    var existItem = me.items[key];

    var current = new Date(Date.now() - me._maxMinute * 60 * 1000);

    var currentMonth = current.getMonth() + 1;
    if (currentMonth < 10) {
        currentMonth = '0' + currentMonth;
    }
    var currentDay = current.getDate();
    var currentMinute = current.getMinutes();
    var currentHour = current.getHours();

    var timeKey = appUtil.getFormatTime(current);

    // 当发现是前一天的数据的时候，做相应的处理

    if (existItem && Object.keys(existItem).length) {
        Object.keys(existItem).forEach(function (subKey) {

            var parts = subKey.split('/');

            if (parts && parts[2]) {
                if (parts[2] <= timeKey) {
                    result[key][subKey] = existItem[subKey];
                    delete existItem[subKey];
                }
            }
            else {
                delete existItem[subKey];
            }

        });
    }

    return result;
};

