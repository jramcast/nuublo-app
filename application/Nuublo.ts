import MessageStream from '../useCases/ports/MessageStream';
import MessageClassifier from '../domain/ports/MessageClassifier';
import discoverWeatherMessages from '../useCases/discoverWeatherMessages';
import Broadcaster from './ports/Broadcaster';


/**
 * The Nuublo app.
 */
export default {

    /**
     * Starts the app.
     * You should provide one options object parameter that includes:
     * - settings object
     * - Broadcaster object: A broadcaster to emit messages to users
     * - Stream: The message of incoming messages
     * - Classifier: The classifier that decides whether or not a message is weather related
     */
    start:  function start({ settings, broadcaster, stream, classifier }: {
        settings: any,
        broadcaster: Broadcaster,
        stream: MessageStream,
        classifier: MessageClassifier
    }) {
        broadcaster.start(settings);
        discoverWeatherMessages(stream, broadcaster, classifier);
    }

};
