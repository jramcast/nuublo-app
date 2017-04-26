window.addEventListener('DOMContentLoaded', main);

function main() {

  var mymap = L.map('mapid').setView([51.505, -0.09], 13);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.outdoors',
    accessToken: 'pk.eyJ1IjoianJhbWNhc3QiLCJhIjoiY2oxeHVxajRpMDAwNTMyazBkcGdlMTMyOSJ9.V7XAX7sk8FlfraUcD6APhg'
  })
  .addTo(mymap);

  var socket = io('http://localhost:8888');
  socket.on('tweet', function (tweet) {
    if (tweet.coordinates) {
      console.log('COORDINATES ', tweet.coordinates);
      var point = [tweet.coordinates.coordinates[1], tweet.coordinates.coordinates[0]];
      L.marker(point)
        .addTo(mymap)
        .bindPopup(`
         COORDINATES
          USER:   ${tweet.user.name} <br>
          TEXT:   ${tweet.text} <br>
          <img width="100px" src="${tweet.entities.media && tweet.entities.media.length > 0 ? tweet.entities.media[0].media_url : ''}"></img>
          <hr>`);
    }

    if (tweet.place) {
      console.log('PLACE ', tweet.place);
      var points = tweet.place.bounding_box.coordinates[0].map(point => [point[1], point[0]]);
      L.polygon(points).addTo(mymap)
      .bindPopup(`
          USER:   ${tweet.user.name} <br>
          TEXT:   ${tweet.text} <br>
          <img width="100px" src="${tweet.entities.media && tweet.entities.media.length > 0 ? tweet.entities.media[0].media_url : ''}"></img>
          <hr>`);
    }

    /*const div = document.createElement('div');
    div.innerHTML = `
    USER:   ${tweet.user.name} <br>
    TEXT:   ${tweet.text} <br>
    PLACE:  ${tweet.place ? JSON.stringify(tweet.place) : ''} <br>
    GEO:    ${tweet.coordinates ? JSON.stringify(tweet.coordinates) : ''} <br>
    <img src="${tweet.entities.media && tweet.entities.media.length > 0 ? tweet.entities.media[0].media_url  : '' }"></img>
    <hr>`
    document.body.insertBefore(div,document.body.childNodes[0]);*/
  });

}