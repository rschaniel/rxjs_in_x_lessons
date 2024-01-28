import { of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';


of(1).subscribe({
    next: value => {
        of(2).pipe(
            map(inner => inner + value)
        ).subscribe(console.log)
    }
});


of(1).pipe(
    concatMap(value => of(2)
        .pipe(
            map(inner => inner + value))
    )
).subscribe(console.log);