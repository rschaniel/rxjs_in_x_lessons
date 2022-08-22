import { of, interval, Observable } from 'rxjs';
import { delay, filter, map, mergeScan, switchScan, take } from 'rxjs/operators';


describe('switchScan', () => {

    it('should continuously execute the reducer function', () => {
        of(1,2,3,4).pipe(
            switchScan((acc, curr) => of(acc + curr), 0)
        ).subscribe(console.log);
    });

    it('should switch', done => {
        const upload = (ids: number[]) => new Observable(observer => {
            observer.next(`START upload ${ids.join(',')}`);

            // more ids take longer to upload, but exactly 4 elements are very quick ;)
            setTimeout(() => {
                observer.next(`FINISHED upload of ${ids.join(',')}`);
                observer.complete();
            }, ids.length === 4 ? 1 : ids.length * 100);

            return () => {
                console.log(`TEARDOWN upload of ${ids.join(',')}`);
            }
        });

        interval(5).pipe(
            map(n => {
                if (n == 0) { return [1,2] }
                else if (n == 1) { return [1,2,3] }
                else if (n == 2) { return [1,2,3,4] }
                else if (n == 3) { return [1,2,3,4,5] }
            }),
            take(4),
            filter(Boolean),
            switchScan((acc, curr) => upload(curr).pipe(
                map(result => `${acc} ${result}`)
            ),
        '')
        ).subscribe({
            next: (x) => console.log(x),
            complete: done
        });

        // START upload 1,2
        // TEARDOWN upload of 1,2
        // START upload 1,2 START upload 1,2,3
        // TEARDOWN upload of 1,2,3
        // START upload 1,2 START upload 1,2,3 START upload 1,2,3,4
        // START upload 1,2 START upload 1,2,3 FINISHED upload of 1,2,3,4
        // TEARDOWN upload of 1,2,3,4
        // START upload 1,2 START upload 1,2,3 FINISHED upload of 1,2,3,4 START upload 1,2,3,4,5
        // START upload 1,2 START upload 1,2,3 FINISHED upload of 1,2,3,4 FINISHED upload of 1,2,3,4,5
        // TEARDOWN upload of 1,2,3,4,5
    });
});
