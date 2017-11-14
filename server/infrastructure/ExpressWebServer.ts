import express = require('express');
import http = require('http');
import socketIo = require('socket.io');
import logger from './Logger';


/**
 * Socket.io instance
 */
let io;


/**
 * The server object.
 * Once started, it can broadcast messages using socket.io
 */
export default {

    start: function start(opts: any) {
        const app = express();
        app.use(express.static(`${__dirname}/../../client`));
        const server = new http.Server(app);
        io = setupSockets(server);
        server.listen(opts.port);
        logger.info(`Web server listening on port ${opts.port}...`);
    },

    broadcast: function broadcast(tweet) {
        io.sockets.emit('tweet', tweet);
    }

};


function setupSockets(server) {
    io = socketIo(server);
    return io;
}
