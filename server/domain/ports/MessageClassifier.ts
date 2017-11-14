import Message from '../../domain/Message';

/**
 * Classifies incoming messages.
 */
export default interface MessageClassifier {

    /**
     * Classifies a message as weather related or not
     */
    isMessageAboutWeather(message: Message): Promise<Boolean>;
}