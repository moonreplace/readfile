var memWatch = require('memwatch-next');

module.exports = function () {
    memWatch.on('leak', function (info) {
        console.error(info);

        var heapdump = require('heapdump');

        var file = './' + process.pid + '-' + Date.now() + '.heapsnapshot';

        heapdump.writeSnapshot(file, function(err){});
    });
};


