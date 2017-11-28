import Message from '../domain/Message';


/**
 * A broadcaster
 * Emits messages to the users
 */
export default interface Broadcaster {

    /**
     * Starts the broadcaster
     */
    start(settings: any);

    /**
     * Broadcasts a message to the clients
     */
    broadcast(message: Message);

}