import { Observable } from 'rxjs';

export const randomNumberGenerator$ = new Observable<number>((subscriber) => {
    const interval = setInterval(() => {
        const randomNumber = Math.floor(Math.random() * 100);
        subscriber.next(randomNumber);
    }, 1000);

    return () => {
        clearInterval(interval);
    }
});