
const Bleacon = require('bleacon');
const config = require('./config');
const express = require('express');

const app = express();

app.use(express.static('public'));

const SIGHTING_INTERVAL = 3.5;
const IDENTIFIER = '1111111111111111111111111111111';


let beaconSightings = [];


setInterval(() => {
  console.log('PRUNING');
  beaconSightings = beaconSightings.reduce((result, sighting) => {
    if (sighting.time < new Date() - (SIGHTING_INTERVAL * 1000)) {
      return result;
    }
    return result.concat([sighting]);
  }, []);
}, 500);


const uuid = Array(31).fill('1').concat([config.deviceID || 'A']).join('');

console.log('starting beacon at', uuid);

Bleacon.startAdvertising(uuid);
Bleacon.startScanning();
Bleacon.on('discover', (beacon) => {
  console.log('BEACON', beacon);
  if (
    (beacon.proximity === 'near' || beacon.proximity === 'immediate') &&
      beacon.uuid.includes(IDENTIFIER)
  ) {
    beaconSightings.push({
      uuid: beacon.uuid.replace(IDENTIFIER, ''),
      time: Number(new Date()),
    });
  }
});


app.get('/devices', (req, res) => {
  console.log('SIGHTING UUIDs', beaconSightings.map(sighting => sighting.uuid));
  res.json({
    visibleBeacons: [...new Set(beaconSightings.map(sighting => sighting.uuid))],
    id: uuid,
  });
});

app.listen(3000, () => {
  console.log('listening on port 3000!');
});
