import { createTestScheduler } from '../misc/test_scheduler';
import { observeOn } from 'rxjs/operators';
import { interval, animationFrameScheduler } from 'rxjs';


describe('observeOn', () => {

    it('with complete', () => {
        createTestScheduler().run((helpers) => {

            const progressBarDiv = new HTMLDivElement();

            interval(10)
                .pipe(observeOn(animationFrameScheduler))
                .subscribe(newHeight => {
                    progressBarDiv.style.height = newHeight + 'px';
                });
        });
    });
});
