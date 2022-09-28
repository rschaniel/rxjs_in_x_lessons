import { of, interval, Observable } from 'rxjs';
import { audit, auditTime, map, take } from 'rxjs/operators';


describe('audit and auditTime', () => {
    describe('audit', () => {
        it('should silence values until other Observable emits', (done) => {
            interval(100).pipe(
                map(v => v + 1),
                take(20),
                audit(ev => interval(500)),
            ).subscribe({
                next: console.log,
                complete: done
            })
            // 5
            // 10
            // 15
            // 20
        });
    });

    describe('auditTime', () => {
        it('should silence values during a certain time', (done) => {
            interval(100).pipe(
                map(v => v + 1),
                take(20),
                auditTime(500),
            ).subscribe({
                next: console.log,
                complete: done
            })
            // 5
            // 10
            // 15
            // 20
        });
    });
});
