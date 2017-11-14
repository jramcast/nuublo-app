import 'jest';
import sinon = require('sinon');
import discoverWeatherMessages from '../../server/useCases/discoverWeatherMessages';
import MessageStream from '../../server/useCases/ports/MessageStream';
import MessageBroadcaster from '../../server/useCases/ports/MessageBroadcaster';


const sandbox = sinon.sandbox.create();

afterEach(() => {
    sandbox.restore();
});

describe('USE CASE discoverWeatherMessages(): ',  () => {

    test('starts message collector', () => {

        // prepare mocks for the use case
        const stream: MessageStream = { consume: sinon.spy(), onMessageReceived: sinon.spy() };
        const broadcaster: any = {};
        const classifier: any = {};

        // run use case
        discoverWeatherMessages(
            stream,
            broadcaster,
            classifier
        );

        //check
        expect(stream.consume.called).toBe(true);
    });

});