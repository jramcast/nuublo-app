const util = require('util');
const request = require('request');
import Message from '../domain/Message';
import MessageClassifier from '../domain/ports/MessageClassifier';
import logger from './Logger';


/**
 * Classifies weather messages using an external machine learning service
 * that decides whether or not a message is about weather.
 */
export default class MachineLearningClassifier implements MessageClassifier {

    serviceUrl: String;

    constructor(serviceUrl) {
        this.serviceUrl = serviceUrl;
    }

    isMessageAboutWeather(message: Message): Promise<Boolean> {
        return this.callClassifier(message).then(result => {
            const classes = Object.keys(result.classes);
            // s5 and k7 are classes that indicate message not related to weather
            return result.classes && !classes.includes('s5') && !classes.includes('k7');
        });
    }

    private callClassifier(tweet) {
        const post = util.promisify(request.post);
        const url = this.serviceUrl;
        const formData = { text: tweet.text };
        return post({ url, formData })
            .then(response => response.toJSON())
            .then(response => {
                if (response.statusCode !== 201) {
                    throw new Error(`Invalid response:${response.statusCode}`);
                }
                return JSON.parse(response.body);
            })
            .catch(error => {
                logger.warn(`Weather classify service returned an invalid response. Error: ${error}`);
                return { classes: {}};
            });
    }

}
