import { asyncScheduler, queueScheduler, asapScheduler } from 'rxjs';

describe('scheduler', () => {

    it('should deliver 1 first', (done) => {
        asyncScheduler.schedule(() => {
            console.log('2');
            done();
        });
        asapScheduler.schedule(() => console.log('1'));
        queueScheduler.schedule(() => console.log('1'));
    });

});