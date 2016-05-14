/*
  Continously scans for peripherals and prints out message when they enter/exit

    In range criteria:      RSSI < threshold
    Out of range criteria:  lastSeen > grace period

  based on code provided by: Mattias Ask (http://www.dittlof.com)
*/
var noble = require('../index');
var http = require('http');

var EXIT_GRACE_PERIOD = 100; // milliseconds

var inRange = [];
var targetUuid = '68c90b04d20c'

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
var opt = {
  host: 'dweet.io',
  path: 'dweet/for/osaki-ao?hello=workd'
}

var callback = function(response) {
  response.on('data', function (c) {
      console.log('http')
    
    
  })

  response.on('end', function () {
    
  })
}

setInterval(function() {
  setTimeout(console.log('time'),1000)
  for (var id in inRange) {
       
//    if (inRange[id].lastSeen < (Date.now() - EXIT_GRACE_PERIOD)) {
      var peripheral = inRange[id].peripheral;

      console.log('"' + peripheral.advertisement.localName + '" exited (RSSI ' + peripheral.rssi + ') ' + new Date());
      
      var req = http.request(opt,callback).end()


//      http.get('https://dweet.io/get/latest/dweet/for/osaki-aozora',(res){
//        console.log(res)
//      })
      delete inRange[id];

    }
//  }
}, EXIT_GRACE_PERIOD / 2);

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});
