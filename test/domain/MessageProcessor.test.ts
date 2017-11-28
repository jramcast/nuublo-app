
import 'jest';
import sinon = require('sinon');
import Message from '../../domain/Message';
import MessageProcessor from '../../domain/MessageProcessor';

const sandbox = sinon.sandbox.create();

afterEach(() => {
    sandbox.restore();
});

describe('MessageProcessor: ',  () => {

    test('isMessageValid() returns false when message not localized', async (done) => {
        // prepare mock classifier and message without localization
        const classifier = { isMessageAboutWeather: sinon.spy() };
        const message = new Message('hola', null, null);
        // process the message
        const processor = new MessageProcessor(classifier);
        const valid = await processor.isMessageValid(message);
        // check
        expect(valid).toBeFalsy();
        done();
    });

    test('isMessageValid() returns true when message is localized as a city and is classified positively',
        async (done) => {
            // prepare mock classifier and message localized in a city
            const classifier = { isMessageAboutWeather: sinon.stub().resolves(true) };
            const place = { place_type: 'city' };
            const message = new Message('hola', place, null);
            // process the message
            const processor = new MessageProcessor(classifier);
            const valid = await processor.isMessageValid(message);
            // check
            expect(valid).toBeTruthy();
            done();
        }
    );

});