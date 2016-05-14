var noble = require('../index');

noble.on('stateChange', function(state) {
  console.dir(state)
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});


var peripheralIdOrAddress = '68c90b04d20c'

noble.on('discover', function(peripheral) {
//    console.dir(peripheral)
    console.dir(peripheral.uuid)
    if (peripheral.id === peripheralIdOrAddress || peripheral.address === peripheralIdOrAddress) {
      data = peripheral.rssi
      console.dir("-------------------")
      console.dir(data)
    }
});
