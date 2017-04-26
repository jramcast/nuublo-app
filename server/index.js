const tweetsCollector = require('./tweets/collector');


const options = {
    twitter: {
        track: [
            'colaboradoresdeltiempo',
            'tiempobrasero',
            'Tiempo_Mercedes',
            'mitiempoen',
            '#eltiempo',
            '@AEMET',
            '#AEMET',
            'radar tormenta',
            'radar precipitacion',
            'radar copos',
            'radar nieve',
            'radar nevando',
            'radar granizo',
            'radar rayos',
            'radar lluvia',
            'radar chubascos',
            'radar aemet',
            'sinobas',
            'ecazatormentas',
            'la que esta cayendo nieve',
            'la que esta cayendo lluvia',
            'la que esta cayendo granizo',
            'la que esta cayendo tormenta',
            'la que esta cayendo rayos',
            'nieve cuajando',
            'Meteodemallorca',
            '@NWSSPC',
            'metoffice',
            'manera de llover',
            'manera de nevar',
            'no para de llover',
            'no para de nevar',
            '@eltiempoes',
            'MeteoAlbaceteDR',
            'cumulonimbus tormenta',
            '@SpainStormPred',
            '@spainsevere',
            'banda de precipitacion',
            'frente precipitacion',
            'nevando',
            'nieva',
            'lloviendo',
            'llueve',
            'granizando',
            'tormenta rayos',
            'tormenta relampagos',
            'tormenta truenos',
            'tormenta fuerte',
            'viento fuerte',
            'nublando',
            'meteorologica',
            'picazomario',
            'aemet',
            'aemet avisos',
            'rain radar',
            'temporal viento',
            'temporal lluvia',
            'temporal nieve',
            'ciclogenesis',
            'instaweather',
            'aguanieve',
            'llueve mucho',
            'aguacero',
            'diluviando',
            'lasextameteo',
            'lluvia intensa',
            'comenzado llover',
            'comenzando llover',
            'comenzado nevar',
            'comenzando nevar',
            'empezado llover',
            'empezando llover',
            'empieza llover',
            'comienza llover',
            'empezado nevar',
            'empezando nevar',
            'empieza nevar',
            'comienza nevar',
            'llover intensidad',
            'nevar intensidad',
            'tormenta aparato electrico',
            'tromba de agua',
            'nubes desarrollo',
            'polar vortex',
            'vortice polar'
        ].join(','),
        follow: [
            '89707859',
            '1857150498',
            '310806928',
            '1060403089',
            '1095547530',
            '760166790',
            '767056579745185793',
            '767043893661724672',
            '2544227706',
            '424217382',
            '4038086236',
            '3837113362',
            '2190647784',
            '1588390848',
            '2939588943',
            '1696460815',
            '1190035932',
            '115183451',
            '590060558',
            '1337011070',
            '16117029',
            '427643966',
            '58203491',
            '973903266',
            '567089833',
            '229066643',
            '767056579745185793',
            '87376791',
            '248149823',
            '2238882655',
            '344712910',
            '1076408665',
            '140000155',
            '1196554356',
            '293556004',
            '125396474',
            '270624733',
            '45581271',
            '556410699',
            '2362469894',
            '552223095',
            '3398333033',
            '21706413',
            '798016597',
            '212931502',
            '2864517358',
            '359893504',
            '555711818',
            '249060435',
            '746400355949383680',
            '762974004391112704',
            '1263826782',
            '188685493'
        ].join(',')
    },
}


const url = require('url');
const path = require('path');
const fs = require('fs');
const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const port = process.env.PORT || 8888;

function handler(request, response) {

  const uri = url.parse(request.url).pathname;
  let filename = path.join(process.cwd(), 'client/', uri);

  fs.exists(filename, (exists) => {
    if (!exists) {
      response.writeHead(404, { 'Content-Type': 'text/plain'});
      response.write('404 Not Found\n');
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) {
      filename += '/index.html';
    }

    fs.readFile(filename, 'binary', (err, file) => {
      if (err) {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.write(`${err}\n`);
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, 'binary');
      response.end();
    });
  });
}

const connectedSockets = [];

tweetsCollector
    .start(options.twitter)
    .onTweet((tweet) => {
      console.log(tweet.text);
      connectedSockets
        .forEach(socket => socket.emit('tweet', tweet));
    });

io.on('connection', (socket) => {
  connectedSockets.push(socket);
});

app.listen(parseInt(port, 10));

console.log('Server running at\n  => http://localhost:' + port + '/\nCTRL + C to shutdown');
