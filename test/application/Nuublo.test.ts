
import 'jest';
import sinon = require('sinon');
import Nuublo from '../../application/Nuublo';
import Broadcaster from '../../application/ports/Broadcaster';
import MessageStream from '../../useCases/ports/MessageStream';

const sandbox = sinon.sandbox.create();

afterEach(() => {
    sandbox.restore();
});

describe('Nuublo App: ',  () => {

    test('start() should run server.start()', () => {
        // mock
        const broadcaster: Broadcaster = { start: sinon.spy(), broadcast: sinon.spy() };
        const stream: MessageStream = { consume: sinon.spy(), onMessageReceived: sinon.spy() };
        const options = {
            settings: {},
            broadcaster,
            stream,
            classifier: {}
        };
        // run function
        Nuublo.start(options);
        // check
        expect(broadcaster.start.called).toBeTruthy();
    });

});