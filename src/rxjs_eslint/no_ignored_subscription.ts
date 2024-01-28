import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

interval(1e3).pipe().subscribe(
    (value) => console.log(value)
);

interval(1e3).pipe(take(1)).subscribe(
    (value) => console.log(value)
);