/**
 * @file config.js, 一些配置性选项
 * @author daihuiming(moonreplace@163.com)
 */

var path = require('path');

/**
 * 输入的相关配置
 */
exports.input = {
    file: {
        sourceFile: '/home/movie/nginxlog/access.log',
        interval: 200 // 单位是ms
    },
    from: 'file' // 现在只有file这一种方式
};

/**
 * server的相关配置
 */
exports.server = {
    net: {
        port: 8012,
        host: 'dev036.baidu.com'
    },
    web: {
        port: 8013
    }
};

/**
 * 一次发送的多少条记录，隔多久得一次配置文件
 */
exports.perform = {
    count: 500
};

/**
 * 数据库的相关配置
 */
exports.db = {
    basePath: path.join(path.resolve('.'), 'dbs'),
    keySep: '/' //用来产生组成key的各部分的分隔符
};

/**
 * 对数据相关的过滤项
 */
exports.filter = {

    // 排除掉不相关的字段
    exceptKeys: [
        't',
        'pvid',
        'resid',
        'from',
        'version',
        'dav_ver',
        'da_trd'
    ],

    // 排除掉不参与产生key的字段
    filterKeys: [
        'da_elapsed',
        'da_ver',
        'xpath',
        'da_abtest',
        'da_act',
        'da_thirdpar',
        'uid'
    ],
    // mapKeys
    mapDaAct: {
        BNJSReady: 'perform',
        movieRenderHtml: 'perform',
        pageRender: 'perform',
        compileTemplate: 'perform',
        cinemaLinkTime: 'perform',
        loadJSReady: 'perform',
        compileTemplate: 'perform',
        api: 'perform'
    }
};
