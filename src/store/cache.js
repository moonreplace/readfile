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

    this._maxMinute = 4;
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

    // 延迟2分钟
    var after = Date.now() + me._maxMinute * 60 * 1000;

    // 如果发现有数据就进行处理，如果发现整个单项缓存都没有数据了就关掉
    if (existItem && Object.keys(existItem).length) {
        Object.keys(existItem).forEach(function (subKey) {

            var currentValue = existItem[subKey];

            // 如果有值了我们就进行比较，我们能容忍的误差在5分钟以内，否则删除，不然会内存泄露
            if (currentValue) {
                if (currentValue.now) {
                    // 如果已经超过2分钟了，我们就认为可以了
                    if (currentValue.now >= Date.now()) {
                        result[key][subKey] = currentValue;
                        delete existItem[subKey];
                    }
                }
                else {
                    existItem[subKey].now = after;
                }
            }   
        });
    }
    else {
        delete me.items[key];
    }

    return result;
};

