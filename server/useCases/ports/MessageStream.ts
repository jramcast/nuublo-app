import Message from '../../domain/Message';

/**
 * A stream of messages
 */
export default interface MessageStream {

    /**
     * Consumes the stream
     */
    consume();

    /**
     * Sets the callback to use when a new
     * message is received
     */
    onMessageReceived(callback: (message: Message) => void);

}