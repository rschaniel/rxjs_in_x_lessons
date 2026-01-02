import { switchMap, retry, map } from 'rxjs/operators';
import { of } from 'rxjs';


describe('retry', () => {
    let numberOfCalls = 0;
    const call = () => {
        if (numberOfCalls < 1) {
            numberOfCalls++;
            throw new Error('Temporary error');
        }
        return of('success');
    }

    it('will be fine the second time', () => {
        of(1).pipe(
            switchMap(_ => call()),
            map(result => result),
            retry(1),
        ).subscribe({
            next: (v) => {
                expect(v).toBe('success');
            }
        });
    });
});
