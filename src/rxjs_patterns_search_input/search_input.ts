const { ajax } = rxjs.ajax;
const { fromEvent, switchMap, debounceTime, distinctUntilChanged, tap, pluck, filter, map, startWith,
    BehaviorSubject, timeout, catchError, retry } = rxjs;


interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

const formatToHtml = (posts: Post[]): string => {
    return posts.reduce((existing, post) => existing +
        '<div class="post">' +
            '<h2>' + post.title + '</h2>' +
            '<p>' + post.body + '</p>' +
        '</div>', '')
};

const displayError = (errorMessage: string) => {
    const errorContainer = document.getElementById('errors');

    if (errorContainer) {
        errorContainer.innerHTML = '<p>' + errorMessage + '</p>';
    }
};
const clearErrors = () => {
    displayError('');
};

const searchify = (searchFieldId: string, resultContainerId: string, loadingIndicatorId: string) => {
    if (!searchFieldId || !resultContainerId || !loadingIndicatorId) {
        console.error('ID not provided');
        return;
    }

    const resultContainer = document.getElementById(resultContainerId);
    const searchField = document.getElementById(searchFieldId);
    const loadingIndicator = document.getElementById(loadingIndicatorId);
    if (!resultContainer || !searchField || !loadingIndicator) {
        console.error('Some element not found');
        return;
    }

    const REQUEST_TIMEOUT = 2000;
    const loadingSubject$ = new BehaviorSubject(false);
    const isLoadingShown$ = loadingSubject$.asObservable().subscribe({ next: (show) => {
        loadingIndicator.style.visibility = show ? 'visible' : 'hidden';
    }});

    fromEvent(searchField, 'keyup')
        .pipe(
            debounceTime(150),
            filter(Boolean),
            pluck('target', 'value'),
            map(value => value.trim()),
            filter(searchTerm => searchTerm.length > 2),
            distinctUntilChanged(),
            tap(_ => loadingSubject$.next(true)),
            switchMap(searchTerm => ajax<Post[]>(`${apiUrl}?title_like=${searchTerm}`).pipe(
                timeout(REQUEST_TIMEOUT))
            ),
            tap(_ => loadingSubject$.next(false)),
            pluck('response'),
            catchError(error => {
                loadingSubject$.next(false);
                displayError(error.message);
                return [];
            }),
        )
        .subscribe({
            next: (response) => {
                resultContainer.innerHTML = formatToHtml(response);
            }
        });
};

// @ts-ignore
window.searchify = searchify;