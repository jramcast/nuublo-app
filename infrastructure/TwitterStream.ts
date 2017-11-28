import 'twitter'; // import types
const Twitter = require('twitter');
import Message from '../domain/Message';
import logger from './Logger';
import MessageStream from '../useCases/ports/MessageStream';

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const reconnectAfterMinutes: number = 1;
let reconnectTimeout: NodeJS.Timer;


/**
 * Connects to a twitter stream to collect tweets.
 * Reconnects automatically if the connection is closed.
 */
export default class TwitterStream implements MessageStream {

    options: any;
    messageHandler: (message: Message) => void;

    constructor(options) {
        this.options = options;
    }

    /**
     * Starts collecting tweets
     */
    consume() {

        logger.info('Opening stream for tweets...');
        const stream = client.stream('statuses/filter', this.options);
        // If we do not receive anything after opening the stream,
        // we would try to reconnect
        reconnectTimeout = setTimeoutForReconnection();

        stream.on('data', (tweet: any) => {
            if (tweet.text) {
                const tweetMessage = new Message(
                    tweet.text,
                    tweet.place,
                    tweet.coordinates
                );
                // connection is alive, so we do not need to reconnect
                clearTimeout(reconnectTimeout);
                this.messageHandler(tweetMessage);
                reconnectTimeout = setTimeoutForReconnection();
            }
        });

        stream.on('error', (error) => {
            logger.error(error);
            cleanStream(stream);
            reconnectAfter(60);
        });

        stream.on('end', (response: any) => {
            logger.info(`Stream ended. Status: ${response.statusCode} ${response.statusMessage}`);
            cleanStream(stream);
            reconnectAfter(60);
        });

        function cleanStream(str: any) {
            str.removeAllListeners();
        }

        function reconnectAfter(seconds: number) {
            setTimeout(
                (db, opts) => this.consume(opts),
                seconds * 1000
            );
            logger.info(`Reconnecting after ${seconds} seconds...`);
        }

        function setTimeoutForReconnection() {
            return setTimeout(
                () => {
                    logger.warn('Nothing received recently, so we reconnect ');
                    reconnectAfter(0);
                },
                1000 * 60 * reconnectAfterMinutes
            );
        }
    }

    onMessageReceived(handler: (message: Message) => void) {
        this.messageHandler = handler;
    }

}