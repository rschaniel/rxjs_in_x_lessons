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
});