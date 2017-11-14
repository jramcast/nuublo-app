import MessageClassifier from './ports/MessageClassifier';
import Message from './Message';


/**
 * Process a message when it is received
 */
export default class MessageProcessor {

    classifier: MessageClassifier;

    constructor(classifier: MessageClassifier) {
        this.classifier = classifier;
    }

    async isMessageValid(message: Message) {
        return message.isLocalized() && await this.classifier.isMessageAboutWeather(message);
    }

}