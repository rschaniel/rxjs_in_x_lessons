import { concat, iif, of, Observable, throwError, asyncScheduler } from 'rxjs';
import { testScheduler } from '../../misc/test_scheduler';

interface AuthService {
    getToken(): Observable<string>;
}

interface ItemService {
    getItems(): Observable<number[]>;
}

const mockServices = function (cold: any) {
    const authService: AuthService = {
        getToken: () => {
        return cold('a', {a: 'ey123'});
    }};
    const itemService: ItemService = {
        getItems: () => {
        return cold('a', {a: [1, 2, 3]});
    }};
    return {authService, itemService};
};

describe('iif', () => {

    it('should authenticate if necessary', () => {
        testScheduler.run((helpers) => {
            const {expectObservable, cold} = helpers;

            const isAuthenticated: () => boolean = () => false;
            const {authService, itemService} = mockServices(cold);

            expectObservable(iif(
                isAuthenticated,
                itemService.getItems(),
                authService.getToken())
            ).toBe('a', { 'a': 'ey123' });
        });
    });

    it('should get the items if already authenticated', () => {
        testScheduler.run((helpers) => {
            const {expectObservable, cold} = helpers;

            const isAuthenticated: () => boolean = () => true;
            const {authService, itemService} = mockServices(cold);

            expectObservable(iif(
                isAuthenticated,
                itemService.getItems(),
                authService.getToken())
            ).toBe('a', { 'a': [1,2,3] });
        });
    });
});
