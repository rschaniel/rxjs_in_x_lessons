import { createTestScheduler } from '../../misc/test_scheduler';
import { map, tap } from 'rxjs/operators';


describe('tap', () => {

    it('does side effects', () => {
        createTestScheduler().run((helpers) => {
            const { cold } = helpers;
            let isLoading = true;

            cold('---r', { r: { json: '{ "content": "content" }' }}).pipe(
                map(r => r.json),
                tap(_ => isLoading = false),
            );
        });
    });
});
