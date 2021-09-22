import { Observable, of } from 'rxjs';


describe('an observable based on the offline and online event', () => {

    it('should emit on change', (done) => {
        const networkStatus$ = new Observable<'offline' | 'online'>((subscriber) => {
            const offlineHandler = function(event){
                subscriber.next('offline');
            };
            let onlineHandler = function(event){
                subscriber.next('online');
            };

            window.addEventListener('offline', offlineHandler);
            window.addEventListener('online', onlineHandler);

            return () => {
                window.removeEventListener('offline', offlineHandler);
                window.removeEventListener('online', onlineHandler);
            }
        });


        networkStatus$.subscribe({ next: (status) => {
                console.log(status);
                if (status === 'online') {
                    done();
                }
            }
        });

        window.dispatchEvent(new Event('offline'));
        window.dispatchEvent(new Event('online'));
    });
});
