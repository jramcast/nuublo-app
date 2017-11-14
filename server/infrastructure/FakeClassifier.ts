const util = require('util');
const request = require('request');
import Message from '../domain/Message';
import MessageClassifier from '../domain/ports/MessageClassifier';
import logger from './Logger';


/**
 * Fake implementation if a message classifier.
 * For testing and dev purposes.
 */
export default class FakeClassifier implements MessageClassifier {

    isMessageAboutWeather(message: Message): Promise<Boolean> {
        return new Promise(resolve => resolve(true));
    }

}
