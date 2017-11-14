import MessageStream from '../useCases/ports/MessageStream';
import MessageClassifier from '../domain/ports/MessageClassifier';
import discoverWeatherMessages from '../useCases/discoverWeatherMessages';
import Server from './Server';


/**
 * The Nuublo app.
 */
export default {

    /**
     * Starts the app.
     * You should provide one options object parameter that includes:
     * - settings object
     * - Server object: The webserver
     * - Stream: The message of incoming messages
     * - Classifier: The classifier that decides whether or not a message is weather related
     */
    start:  function start({ settings, webserver, stream, classifier }: {
        settings: any,
        webserver: Server,
        stream: MessageStream,
        classifier: MessageClassifier
    }) {
        webserver.start(settings);
        discoverWeatherMessages(stream, webserver, classifier);
    }

};
