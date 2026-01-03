import {
    interval,
    of,
    concat,
    timer,
    merge,
    map,
    switchMap,
    scan,
    tap,
    filter,
    withLatestFrom,
    startWith,
    shareReplay,
    EMPTY,
    fromEvent,
    takeUntil,
    take
} from 'rxjs';

const imageGallery = (containerId: string) => {
    if (!containerId) {
        console.error('Elements not provided');
        return;
    }

    const containerElement = document.getElementById(containerId);
    const imagesContainer = containerElement?.querySelector("#images");
    const forwardButton = containerElement?.querySelector("#forward");
    const backwardButton = containerElement?.querySelector("#back");
    const terminateButton = containerElement?.querySelector("#terminate");

    if (!containerElement || !imagesContainer || !forwardButton || !backwardButton || !terminateButton) {
        console.error('Some element not found in the DOM');
        return;
    }

    const imagesSrcs = [
        'https://picsum.photos/id/1015/600/400',
        'https://picsum.photos/id/1016/600/400',
        'https://picsum.photos/id/1018/600/400',
        'https://picsum.photos/id/1020/600/400',
        'https://picsum.photos/id/1024/600/400',
        'https://picsum.photos/id/1027/600/400',
    ];

    const terminate$ = fromEvent(terminateButton, 'click').pipe(take(1));

    const hover$ = merge(
        fromEvent(imagesContainer, 'mouseenter').pipe(map(() => true)),
        fromEvent(imagesContainer, 'mouseleave').pipe(map(() => false))
    ).pipe(
        takeUntil(terminate$),
        startWith(false),
        shareReplay(1),
    );

    const autoAdvance$ = hover$.pipe(
        switchMap((isHovering) => 
            isHovering ? EMPTY : interval(3000)
        ),
        map(() => 'auto'),
    );

    const forward$ = fromEvent(forwardButton, 'click').pipe(
        takeUntil(terminate$),
        switchMap(() => concat(of('forward'), timer(3000).pipe(map(() => 'auto')))),
    );

    const back$ = fromEvent(backwardButton, 'click').pipe(
        takeUntil(terminate$),
        switchMap(() => concat(of('back'), timer(3000).pipe(map(() => 'auto')))),
    );

    const subscription = merge(autoAdvance$, forward$, back$).pipe(
        withLatestFrom(hover$),
        takeUntil(terminate$),
        filter(([event, isHovering]) => event !== 'auto' || !isHovering),
        map(([event]) => event),
        scan((index, event: string) => {
            if (event === 'forward') {
                return (index + 1) % imagesSrcs.length;
            } else if (event === 'back') {
                return (index - 1 + imagesSrcs.length) % imagesSrcs.length;
            } else { // 'auto'
                return (index + 1) % imagesSrcs.length;
            }
        }, 0),
        tap((index) => {
            const img = imagesContainer?.querySelector("img") as HTMLImageElement | null;
            if (img) {
                img.src = imagesSrcs[index];
            }
        }),
    ).subscribe();

    return subscription;
};

export { imageGallery };