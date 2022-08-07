import { from, of, zip, GroupedObservable, Observable } from 'rxjs';
import { groupBy, mergeMap, reduce, toArray } from 'rxjs/operators';

type ageGroup = 'YOUTH' | 'ADULT' | 'SENIOR';

interface User {
    name: string;
    age: number;
}

type usersGroupedByAge = { [key in ageGroup]?: User[] };

describe('groupBy', () => {

    it('should group the users', () => {
        const users: User[] = [
            { name: 'Sue', age: 17 },
            { name: 'Joe', age: 30 },
            { name: 'Frank', age: 25 },
            { name: 'Steve', age: 12 },
            { name: 'Sarah', age: 35 },
            { name: 'Tom', age: 50 },
            { name: 'Catherine', age: 67 },
        ];

        const result$: Observable<usersGroupedByAge> = from(users).pipe(
            groupBy((u: User): ageGroup => {
                if (u.age < 18) {
                    return 'YOUTH';
                } else if (u.age > 64) {
                    return 'SENIOR';
                } else {
                    return 'ADULT'
                }
            }),
            mergeMap(group => group.pipe(
                reduce((acc, curr: User) => {
                    if (!acc[group.key]) {
                        acc[group.key] = [];
                    }
                    acc[group.key].push(curr);
                    return acc;
                }, {})
            ))
        );

        result$.subscribe(console.log);
    });
});