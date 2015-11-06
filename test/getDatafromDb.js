var levelDb = require('../src/store/level');
var db = levelDb.get('ready-2015-11-4');


var now = new Date();
var key = [now.getHours(), now.getMinutes() - 3].join('-');

key = ['portal', 'ios', key].join('/');
console.log(key);

db.get(key, function (err, data) {
    console.log(data);
});

var stream = db.createReadStream({});

var num = 0;

stream.on('data', function (data) {
    console.log(data.key);
    data.value.forEach(function (value) {
        var time = new Date(value.time);
        console.log(time);
    });
});

stream.on('end', function () {
    console.log(num);
});
