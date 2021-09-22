import { of, Observable, throwError, bindCallback, bindNodeCallback } from 'rxjs';

describe('bindCallback and bindNodeCallback', () => {

    it('should bind', (done) => {
        const heavyTask = (input: number, callback: (string) => void) => {
            setTimeout(() => {
                callback(`heavy task result for input ${input}`);
            }, 1000);
        };

        const heavyTaskObservable = bindCallback(heavyTask);
        const output$ = heavyTaskObservable(5);

        output$.subscribe({
            next: (val) => {
                expect(val).toEqual('heavy task result for input 5');
                done();
            }
        })
    });

    it('should bind with multiple inputs', (done) => {
        const multiplier = (input: number, input2: number, callback: (result: number) => void) => {
            setTimeout(() => {
                callback(input * input2);
            }, 1000);
        };

        const heavyTaskObservable = bindCallback(multiplier);
        const output$ = heavyTaskObservable(5, 3);

        output$.subscribe({
            next: (val) => {
                expect(val).toEqual(15);
                done();
            }
        })
    });

    it('should bind with a node callback too', (done) => {
        const multiplier = (input: number, input2: number, callback: (error: string | undefined, result: number) => void) => {
            setTimeout(() => {
                let result = input * input2;
                const error = result > 1000 ? 'numbers too large' : undefined;
                callback(error, result);
            }, 1000);
        };

        const heavyTaskObservable = bindNodeCallback(multiplier);
        const output$ = heavyTaskObservable(5, 3);

        output$.subscribe({
            next: (val) => {
                expect(val).toEqual(15);
                done();
            }
        })
    });

    it('should bind with a node callback too error case', (done) => {
        const multiplier = (input: number, input2: number, callback: (error: string | undefined, result: number) => void) => {
            setTimeout(() => {
                let result = input * input2;
                const error = result > 1000 ? 'numbers too large' : undefined;
                callback(error, result);
            }, 1000);
        };

        const heavyTaskObservable = bindNodeCallback(multiplier);
        const output$ = heavyTaskObservable(500, 3);

        output$.subscribe({
            error: (err) => {
                expect(err).toEqual('numbers too large');
                done();
            }
        })
    });
});
