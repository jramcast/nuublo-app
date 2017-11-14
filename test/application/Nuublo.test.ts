
import 'jest';
import sinon = require('sinon');
import Nuublo from '../../server/application/Nuublo';
import Server from '../../server/application/Server';
import MessageStream from '../../server/useCases/ports/MessageStream';

const sandbox = sinon.sandbox.create();

afterEach(() => {
    sandbox.restore();
});

describe('Nuublo App: ',  () => {

    test('start() should run server.start()', () => {
        // mock
        const webserver:Server = { start: sinon.spy(), broadcast: sinon.spy() };
        const stream:MessageStream = { consume: sinon.spy(), onMessageReceived: sinon.spy() };
        const options = {
            settings: {},
            webserver,
            stream,
            classifier: {},
        }
        // run function
        Nuublo.start(options);
        // check
        expect(webserver.start.called).toBeTruthy();
    });

});