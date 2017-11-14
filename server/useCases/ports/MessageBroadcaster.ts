import Message from '../../domain/Message';

/**
 * This service broacasts messages to clients.
 */
export default interface MessageBroadcaster {

    /**
     * Broadcasts a message to clients
     */
    broadcast(message: Message);

}