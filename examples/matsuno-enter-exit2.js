/*
  Continously scans for peripherals and prints out message when they enter/exit

    In range criteria:      RSSI < threshold
    Out of range criteria:  lastSeen > grace period

  based on code provided by: Mattias Ask (http://www.dittlof.com)
*/
var noble = require('../index');
var request = require('superagent');

var EXIT_GRACE_PERIOD = 2000; // milliseconds

var inRange = [];
var targetUuid = '68c90b04d20c'
var rssi = ''

noble.on('discover', function(peripheral) {
  
  if (targetUuid != peripheral.uuid) {
    return
  }

  var id = peripheral.id;
  var entered = !inRange[id];

  if (entered) {
    inRange[id] = {
      peripheral: peripheral
    };

    console.log('"' + peripheral.advertisement.localName + '" entered (RSSI ' + peripheral.rssi + ') ' + new Date());
  }

  inRange[id].lastSeen = Date.now();
});

var fetch = function(){
var url = 'https://dweet.io/dweet/for/osaki-ao'
request
  .get(url)
  .query({uuid: targetUuid, strong: rssi})
  .end(function(err, res){
    console.log(res.body);
    for (var id in inRange) {
         
        var peripheral = inRange[id].peripheral;
  
        console.log('"' + peripheral.advertisement.localName + '" exited (RSSI ' + peripheral.rssi + ') ' + new Date());
        rssi = peripheral.rssi
  
        delete inRange[id];
      }
    });
}

setInterval(fetch, EXIT_GRACE_PERIOD / 2);

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});

