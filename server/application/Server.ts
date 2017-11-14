import Message from '../domain/Message';


/**
 * A server.
 * Its capabilities are serving the application and broadcasting messages
 */
export default interface Server {

    /**
     * Starts a web server
     */
    start(settings: any);

    /**
     * Broadcasts a message to the clients
     */
    broadcast(message: Message);
}