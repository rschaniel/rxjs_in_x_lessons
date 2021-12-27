import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { timer } from 'rxjs';
import { map, take } from 'rxjs/operators';


describe('timer', () => {

    it('should count down from 10 to 0', (done) => {
        timer(0, 1000).pipe(
            map(i => 10 - i),
            take(10 + 1),
        ).subscribe(v => {
            console.log(v);
            if (v === 0) {
                done();
            }
        });
    });
});
