import { fromEvent, map, throttleTime } from 'rxjs/dist/types';

fromEvent<MouseEvent>(document, 'click')
    .pipe(
        throttleTime(1000),
        map(event => event.clientX),
    )
    .subscribe(clientX => console.log(`click happened on x coordinate ${clientX}`));