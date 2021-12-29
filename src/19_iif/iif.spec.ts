import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { iif } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';


interface UserService {
    createUser(): Observable<number>;
    updateUser(id: number): Observable<string>;
}

const userService: UserService = {
    createUser: () => of(99).pipe(tap(_ => console.log('user created'))),
    updateUser: (id: number) => of('username').pipe(tap(_ => console.log('user updated'))),
};

describe('iif', () => {

    it('should emit', () => {
        iif(
            () => true,
            of('first'),
            of('second'),
        ).subscribe({ next: console.log });
    });


    it('should emit based on the condition', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            expectObservable(iif(
                () => false,
                of('first'),
                of('second'))
            ).toBe('(a|)', { 'a': 'second' });
        });
    });

    it('not ideal example', () => {
        const createOrUpdateUser$: (action) => Observable<string | number> = (action) => of(action).pipe(
            switchMap((action) => {
                if (action.id) {
                    return userService.updateUser(action.id);
                } else {
                    return userService.createUser();
                }
            })
        );

        createOrUpdateUser$({ name: 'CreateOrUpdate', id: 1}).subscribe({ next: console.log });
        createOrUpdateUser$({ name: 'CreateOrUpdate'}).subscribe({ next: console.log });
    });

    it('good example', () => {
        const createOrUpdateUser$: (action) => Observable<string | number> = (action) => of(action).pipe(
            switchMap((action) => iif(
                    () => !!action.id,
                    userService.updateUser(action.id),
                    userService.createUser(),
                )
            )
        );

        createOrUpdateUser$({ name: 'CreateOrUpdate', id: 1}).subscribe({ next: console.log });
        createOrUpdateUser$({ name: 'CreateOrUpdate'}).subscribe({ next: console.log });
    });
});
