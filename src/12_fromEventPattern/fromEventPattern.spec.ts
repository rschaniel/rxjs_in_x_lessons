import { of, Observable, fromEventPattern } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';

// simplified API
class SomeAPI {
    registerEventHandler(handler: () => void) { return 'token' };
    unregisterEventHandler(token:string) { console.log('operation cancelled')};
}


describe('fromEventPattern', () => {

    it('should create from an event pattern / handler', () => {
        testScheduler.run((helpers) => {
            const addHandler = (handler) => document.addEventListener('click', handler);
            const removeHandler = (handler) => document.removeEventListener('click', handler);

            const clicks$ = fromEventPattern(addHandler, removeHandler);
        });
    });

    it('should cancel via token', () => {
        const someAPI = new SomeAPI();
        const token = someAPI.registerEventHandler(function() {});
        someAPI.unregisterEventHandler(token);

        const someAPIObservable = fromEventPattern(
            (handler) => { return someAPI.registerEventHandler(handler); },
            (handler, token) => someAPI.unregisterEventHandler(token),
        );
    });

    it('should wrap the NodeJS event emitter', () => {
        const EventEmitter = require('events');
        const eventEmitter = new EventEmitter();

        eventEmitter.on('start', () => {
            console.log('started');
            return Math.random();
        });
        eventEmitter.on('off', (randomProcessId) => {
            console.log('ended ' + randomProcessId)
        });

        const $events = fromEventPattern(
            (handler) => () => {
                const number = Math.random();
                console.log('started process ' + number);
                return number;
            },
            (handler, randomProcessId) => console.log('stopped ' + randomProcessId),
        );

        const processId = $events.subscribe();
        eventEmitter.off(processId);
    });
});
