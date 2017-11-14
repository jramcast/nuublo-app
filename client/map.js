/**
 * This module receives messages from the backend and draws them on a map
 */
(function() {

    var MAP_LAYER = 'http://{s}.sm.mapstack.stamen.com/(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/{z}/{x}/{y}.png';
    var INITIAL_POSITION = [40.4, -3];
    var mymap;
    var markers = [];
    var circle;

    window.addEventListener('DOMContentLoaded', main);

    function main() {
        setupMap();
        setupWebSockets();
    }

    function setupMap() {
        // extend default icon to use a canvas icon
        L.Icon.Canvas = L.Icon.extend({
            options: {
                iconSize: new L.Point(20, 20),
                className: 'leaflet-canvas-icon'
            },
            createIcon: function () {
                var e = document.createElement('canvas');
                this._setIconStyles(e, 'icon');
                var s = this.options.iconSize;
                e.width = s.x;
                e.height = s.y;
                this.draw(e.getContext('2d'), s.x, s.y);
                return e;
            },
            createShadow: function () {
                return null;
            }
        });

        mymap = L.map('mapid').setView(INITIAL_POSITION, 5);
        L.tileLayer(MAP_LAYER).addTo(mymap);

        circle = new L.Icon.Canvas({ iconSize: new L.Point(30, 30) });
        circle.draw = function draw(ctx, w, h) {
            var randCol = "#f22";
            ctx.globalCompositeOperation = "source-over";
            ctx.clearRect(-w/2, -h/2,w, h);
            ctx.globalCompositeOperation = 'lighter';
            ctx.translate(w/2, h/2);

            function drawCircle(animatedw, blur) {
                ctx.globalCompositeOperation = "source-over";
                ctx.clearRect(-w/2, -h/2,w, h);
                ctx.globalCompositeOperation = 'lighter';

                ctx.beginPath();
                ctx.arc(0, 0, animatedw, 0, Math.PI*2, true);
                ctx.closePath();
                ctx.fillStyle = randCol;
                ctx.shadowBlur = blur;
                ctx.shadowColor = randCol;
                ctx.fill();

                if (blur < w/2) {
                    requestAnimationFrame(() => drawCircle(animatedw + 0.4, blur+1));
                }
            };
            drawCircle(0, 0);
        };
    }

    function setupWebSockets() {
        const socket = io(
            `http://${window.location.hostname}:${window.location.port}`
        );
        socket.on('tweet', showTweet);
    }

    function showTweet(tweet) {
        let marker;
        let markerOpacity = 0.7;
        if (tweet.coordinates) {
        const point = [tweet.coordinates.coordinates[1], tweet.coordinates.coordinates[0]];
        marker = new L.Marker(point, {icon: circle, opacity: markerOpacity})
            .addTo(mymap)
            .bindPopup(generatePopup(tweet));
        } else if (tweet.place) {
        const width = tweet.place.bounding_box.coordinates[0][2][1] - tweet.place.bounding_box.coordinates[0][0][1];
        const height = tweet.place.bounding_box.coordinates[0][2][0] - tweet.place.bounding_box.coordinates[0][0][0];
        const randomX = tweet.place.bounding_box.coordinates[0][0][1] + (Math.random() * Math.abs(width));
        const randomY = tweet.place.bounding_box.coordinates[0][0][0] + (Math.random() * Math.abs(height));
        marker = new L.Marker([randomX, randomY], {icon: circle, opacity: markerOpacity})
            .addTo(mymap)
            .bindPopup(generatePopup(tweet));
        }

        markers.push(marker);
    }

    function generatePopup(tweet) {
        const url = `https://twitter.com/statuses/${tweet.id_str}`;
        let imgSrc = tweet.entities && tweet.entities.media && tweet.entities.media.length > 0 ? tweet.entities.media[0].media_url : '';
        if (!imgSrc) {
            imgSrc = tweet.extended_tweet && tweet.extended_tweet.entities.media && tweet.extended_tweet.entities.media.length > 0 ? tweet.extended_tweet.entities.media[0].media_url : '';
        }
        return `
            USER:   ${tweet.user && tweet.user.name || ''} <br>
            TEXT:   ${tweet.text} <br>
            URL:    <a href="${url}">${url}</a><br><br>
            CLASSES: <br><i>${JSON.stringify(tweet.classes)}</i><br>
            IMAGE: <br>
            <img width="100px" src="${tweet.entities && tweet.entities.media && tweet.entities.media.length > 0 ? tweet.entities.media[0].media_url : ''}"></img>
        `;
    }


})();

