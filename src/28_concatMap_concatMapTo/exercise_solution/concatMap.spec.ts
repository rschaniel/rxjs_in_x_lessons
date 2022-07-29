import { mergeMap } from 'rxjs/operators';
import { of, ObservableInput, OperatorFunction, ObservedValueOf } from 'rxjs';


export function myConcatMap<T, R, O extends ObservableInput<any>>(
    project: (value: T, index: number) => O,
): OperatorFunction<T, ObservedValueOf<O> | R> {
    return mergeMap(project, 1);
}


describe('myConcatMap', () => {
    it('will work on the inner observable and output in sequential fashion', () => {
        const result$ = of(1,2,3).pipe(
            myConcatMap((v: number) => of(`value ${v}`))
        );

        result$.subscribe(console.log);
        // value 1
        // value 2
        // value 3
    });
});