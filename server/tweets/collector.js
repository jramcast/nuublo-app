/**
 * Connects to a twitter stream to collect tweets.
 * Reconnects automatically if the connection is closed.
 */
const Twitter = require('twitter');
const logger = require('../util/logger');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const reconnectAfterMinutes = 1;
let reconnectTimeout;


/**
 * Collects tweets
 */
class TweetsCollector {

  onTweet(fn) {
    this.onTweetCallback = fn;
  }

  /**
   * Starts collecting tweets
   */
  start(options) {
    logger.info('Opening stream for tweets...');
    const stream = client.stream('statuses/filter', options);
    // If we do not receive anything after opening the stream,
    // we would try to reconnect
    reconnectTimeout = setTimeoutForReconnection();

    stream.on('data', (tweet) => {
      if (tweet && tweet.text) {
          // connection is alive, so we do not need to reconnect
        clearTimeout(reconnectTimeout);
        this.onTweetCallback(tweet);
        reconnectTimeout = setTimeoutForReconnection();
      }
    });

    stream.on('error', (error) => {
      logger.error(error);
      cleanStream(stream);
      reconnectAfter(60);
    });

    stream.on('end', (response) => {
      logger.info(`Stream ended. Status: ${response.statusCode} ${response.statusMessage}`);
      cleanStream(stream);
      reconnectAfter(60);
    });

    function cleanStream(str) {
      str.removeAllListeners();
    }

    function reconnectAfter(seconds) {
      setTimeout(
        (db, options) => start(db, options),
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

}

/**
 * Creates an instance of Tweets collector
 * and opens the stream
 */
TweetsCollector.start = (options) => {
  const collector = new TweetsCollector();
  collector.start(options);
  return collector;
};

module.exports = TweetsCollector;
