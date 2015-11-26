/**
 * @file level.js, 对level进行另外的封装以适应我们的需求
 * @author daihuiming(moonreplace@163.com)
 */
var level = require('level-party');
var levelplus = require('levelplus');
var config = require('../config');
var path = require('path');

module.exports = {

    _maxTime: 5,

    /**
     * 用来缓存当前的所有产生的dbs, 以数据库的name做为key
     *
     * @type {Object}
     */
    dbs: {},
    /**
     * 要访问的数据为的位置
     *
     * @param {string} name 要访问的数据库的地址
     * @param {?Object} dbConfig 要设置的level db的一些配置项
     * @return {Object}
     */
    get: function (name, dbConfig) {
        var me = this;
        // 设立一个缓存时间，如果发现一个数据库长时间未用，我们就把它关闭
        dbConfig = dbConfig || {keyEncoding: 'utf8', valueEncoding: 'json'};
        if (!this.dbs[name]) {
            var dbPath = path.join(config.db.basePath, name); // 得到当前数据库的path

            var db = level(dbPath, dbConfig); // 产生level database
            this.dbs[name] = db; // 加上一些特殊的方法
            this.dbs[name].now = Date.now();
        }

        // 去掉长时间未用的数据库
        Object.keys(this.dbs).forEach(function (dbName) {
            if (me.dbs[dbName].now < Date.now() - me._maxTime * 60 * 1000) {
                me.close(dbName);
            }
        });
        return this.dbs[name];
    },

    /**
     * 把当前的level db从当前目录中删除
     *
     * @param {string} name 要删除的数据库名字
     */
    destroy: function (name) {
        var dbPath = path.join(config.db.basePath, name);
        level.destroy(dbPath, function () {
            delete this.dbs[name]; //
        });
    },

    /**
     * 给level db增加一些方法
     *
     * @param {Object} db leveldb数据库
     */
    plus: function (db) {
        return levelplus(db);
    },

    /**
     * 关掉数据库
     *
     * @param {string} dbName 要关掉的数据库的名称
     *
     */

    close: function (dbName) {
        if (this.dbs[dbName]) {
            this.dbs[dbName].close();
            delete this.dbs[dbName];
        }
    }
};
