/**
 * @file util.js, 各种工具函数
 * @author daihuiming(moonreplace@163.com)
 */

exports.util = {

    getFormatDate: function (needYear, needMonth,needDay, needHour, needMinute, sep, date) {

        var result = [];
        var time = date || new Date();

        sep = sep || '-';

        if (needYear) {
            result.push(time.getFullYear());
        }

        if (needMonth) {
            result.push(time.getMonth() + 1);
        }

        if (needDay) {
            result.push(time.getDate());
        }

        if (needHour) {
            result.push(time.getHours());
        }

        if (needMinute) {
            result.push(time.getMinutes());
        }

        // 给个位数的加上0
        result = result.map(function (key) {
            if (key < 10) {
                key = '0' + k;ey
            }

            return key;
        });

        return result.join('-');

    },

    getFormateDay: function () {
        return this.getFormatDate(true, true, true);
    },

    getFormatTime: function (date) {
        return this.getFormatDate(false, false, false, true, true, '-', date);
    }


};
