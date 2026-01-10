import {
    fromEvent,
    from,
    interval,
    merge,
    map,
    concatMap,
    scan,
    tap,
    switchMap,
    startWith,
    shareReplay,
    EMPTY,
    of,
    delay,
    withLatestFrom
} from 'rxjs';

interface Notification {
    type: 'info' | 'warning' | 'error';
    text: string;
}

interface NotificationWithState extends Notification {
    id: string;
    createdAt: number;
    pausedTime: number; // Total paused time
}

interface NotificationGroup {
    type: 'info' | 'warning' | 'error';
    text: string;
    count: number;
    id: string;
}

const notifications: Notification[] = [
    { type: 'info', text: `New user signed up` },
    { type: 'warning', text: `Database connection lost` },
    { type: 'info', text: `New order received` },
    { type: 'error', text: `Error processing payment` },
    { type: 'info', text: `New order received` },
    { type: 'info', text: `New order received` },
    { type: 'info', text: `New user signed up` },
    { type: 'warning', text: `Disk space low` },
    { type: 'info', text: `New user signed up` },
];

const notificationCenter = (notificationCenterId: string) => {
    if (!notificationCenterId) {
        console.error('Elements not provided');
        return;
    }

    const notificationCenterElement = document.getElementById(notificationCenterId);

    if (!notificationCenterElement) {
        console.error('Some element not found in the DOM');
        return;
    }

    const MAX_NOTIFICATIONS = 5;
    const NOTIFICATION_DURATION = 10000; 

    // Helper functions - pure and testable
    const groupNotifications = (notifications: NotificationWithState[]): NotificationGroup[] => {
        const grouped = new Map<string, NotificationGroup>();
        notifications.forEach((notif) => {
            const key = `${notif.type}:${notif.text}`;
            if (!grouped.has(key)) {
                grouped.set(key, {
                    type: notif.type,
                    text: notif.text,
                    count: 0,
                    id: notif.id,
                });
            }
            grouped.get(key)!.count++;
        });
        return Array.from(grouped.values());
    };

    const renderNotifications = (groups: NotificationGroup[]): void => {
        notificationCenterElement.innerHTML = '';
        groups.forEach((group) => {
            const notifElement = document.createElement('div');
            notifElement.className = `notification notification-${group.type}`;
            
            let html = `<span>${group.text}</span>`;
            if (group.count > 1) {
                html += `<span class="badge"> ${group.count}x</span>`;
            }
            
            notifElement.innerHTML = html;
            notificationCenterElement.appendChild(notifElement);
        });
    };

    const filterExpiredNotifications = (state: NotificationWithState[]): NotificationWithState[] => {
        const now = Date.now();
        return state.filter((n) => {
            const elapsed = (now - n.createdAt - n.pausedTime) / 1000;
            return elapsed < NOTIFICATION_DURATION / 1000;
        });
    };

    const updatePausedTime = (state: NotificationWithState[]): NotificationWithState[] => {
        return state.map((n) => ({
            ...n,
            pausedTime: n.pausedTime + 1000,
        }));
    };

    const addNotification = (state: NotificationWithState[], notification: NotificationWithState): NotificationWithState[] => {
        let newState = [...state, notification];
        return newState.length > MAX_NOTIFICATIONS ? newState.slice(-MAX_NOTIFICATIONS) : newState;
    };

    // Observable definitions
    const hover$ = merge(
        fromEvent(notificationCenterElement, 'mouseenter').pipe(map(() => true)),
        fromEvent(notificationCenterElement, 'mouseleave').pipe(map(() => false))
    ).pipe(startWith(false), shareReplay(1));

    const ticker$ = hover$.pipe(
        switchMap((isHovering) =>
            isHovering ? EMPTY : interval(1000)
        )
    );

    const incomingNotifications$ = from(notifications).pipe(
        concatMap((notification, index) =>
            of(notification).pipe(
                delay(index === 0 ? 0 : 3000)
            )
        ),
        map((notification) => ({
            ...notification,
            id: Math.random().toString(36),
            createdAt: Date.now(),
            pausedTime: 0,
        }))
    );

    // Main reactive stream
    merge(
        incomingNotifications$.pipe(map((n) => ({ type: 'add' as const, payload: n }))),
        ticker$.pipe(map(() => ({ type: 'tick' as const })))
    ).pipe(
        withLatestFrom(hover$),
        scan((state: NotificationWithState[], [event, isHovering]) => {
            switch (event.type) {
                case 'add':
                    return addNotification(state, event.payload);
                case 'tick':
                    return isHovering ? updatePausedTime(state) : filterExpiredNotifications(state);
            }
        }, [] as NotificationWithState[]),
        map((state) => groupNotifications(state)),
        tap((groups) => {
            renderNotifications(groups);
        })
    ).subscribe();
};

export { notificationCenter };