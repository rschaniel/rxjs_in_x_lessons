import { of, Subject } from 'rxjs';
import { randomNumberGenerator$ } from '../2_observable/random_number_generator';

describe('Subject use cases', () => {

    it('allows to share Observables', (done) => {
        const numbers$ = randomNumberGenerator$;
        const subject = new Subject();

        subject.subscribe({ next: (val) => console.log(`A: ${val}`) });
        subject.subscribe({ next: (val) => console.log(`B: ${val}`) });

        const sub = numbers$.subscribe(subject);

        // A: 14
        // B: 14
        // A: 92
        // B: 92

        setTimeout(() => {
            sub.unsubscribe();
            done();
        }, 2_500);
    });
});