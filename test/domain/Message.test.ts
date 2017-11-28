
import 'jest';
import sinon = require('sinon');
import Message from '../../domain/Message';

const sandbox = sinon.sandbox.create();

afterEach(() => {
    sandbox.restore();
});

describe('Message',  () => {

    test('has text', () => {
        const msj = new Message('hola');
        expect(msj.text).toEqual('hola');
    });

});