import MessageStream from './ports/MessageStream';
import MessageBroadcaster from './ports/MessageBroadcaster';
import MessageClassifier from '../domain/ports/MessageClassifier';
import MessageProcessor from '../domain/MessageProcessor';


/**
 * This is the main use case to discover messages about weather
 */
export default function discoverWeatherMessages(
    stream: MessageStream,
    broadcaster: MessageBroadcaster,
    classifier: MessageClassifier
) {
    const processor = new MessageProcessor(classifier);

    stream.consume();
    stream.onMessageReceived(processMessage.bind(this));

    async function processMessage(message) {
        const messageIsValid = await processor.isMessageValid(message);
        if (messageIsValid) {
            broadcaster.broadcast(message);
        }
    }
}
