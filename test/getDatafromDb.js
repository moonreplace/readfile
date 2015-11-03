var levelDb = require('../src/store/level');
var db = levelDb.get('../test/ready-2015-11-3');

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
