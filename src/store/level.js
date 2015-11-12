/**
 * @file level.js, 对level进行另外的封装以适应我们的需求
 * @author daihuiming(moonreplace@163.com)
 */
var level = require('level-party');
var levelplus = require('levelplus');
var config = require('../config');
var path = require('path');

module.exports = {

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
        dbConfig = dbConfig || {keyEncoding: 'utf8', valueEncoding: 'json'};
        if (!this.dbs[name]) {
            var dbPath = path.join(config.db.basePath, name); // 得到当前数据库的path

            var db = level(dbPath, dbConfig); // 产生level database
            console.log(db);
            this.dbs[name] = this.plus(db); // 加上一些特殊的方法
        }
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
