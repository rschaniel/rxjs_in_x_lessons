import { randomNumberGenerator$ } from './random_number_generator';


describe('Random Number Generator', () => {

    it('should output random numbers until unsubscribed', (done) => {
        const randomNumbers: number[] = [];
        const randomNumberSubscription = randomNumberGenerator$.subscribe({
            next: (x) => randomNumbers.push(x),
        });

        setTimeout(() => {
            randomNumberSubscription.unsubscribe();
            console.log(randomNumbers);
            expect(randomNumbers.length).toEqual(2);
            done();
        }, 2_500);
    });

    it('should handle multiple observers', (done) => {
        const randomNumbers1: number[] = [];
        const randomNumbers2: number[] = [];


        const subscription1 = randomNumberGenerator$.subscribe({ next: (x) => randomNumbers1.push(x) });
        const subscription2 = randomNumberGenerator$.subscribe({ next: (x) => randomNumbers2.push(x) });

        setTimeout(() => {
            subscription1.unsubscribe();
            subscription2.unsubscribe();
            console.log(randomNumbers1);
            console.log(randomNumbers2);
            expect(randomNumbers1.length).toEqual(3);
            expect(randomNumbers2.length).toEqual(3);
            done();
        }, 3_500);
    });
});