/**
 * @file router.js 用来定制各种router的配置文件
 * @author daihuiming(moonreplace@baidu.com)
 */
var handlers = require('./handlers');

/**
 * 把app都挂上相应的handler
 *
 * @param {Object} app 当前的server对象
 */

module.exports = function (app) {

    // 获得页面的pv
    app.get(/^\/api\/pv\/(.+?)\/(.+?)$/, handlers.pv);

};
