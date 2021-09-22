import { interval, animationFrameScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';

const progressBarDiv = new HTMLDivElement();

interval(10)
    .pipe(observeOn(animationFrameScheduler))
    .subscribe(newHeight => {
        progressBarDiv.style.height = newHeight + 'px';
    });