const { ajax } = rxjs.ajax;
const { of, fromEvent, tap, filter, map,
    timeout, catchError, concatMap, scan, startWith, takeWhile, debounceTime } = rxjs;

const apiUrl = 'http://localhost:3000/posts';
// GET /posts?_page=1&_per_page=5

interface Feed {
    pages: Page[];
    currentPage: number;
    lastPage?: number;
}

interface Page {
    first: number;
    prev: number | null;
    next: number | null;
    last: number;
    pages: number;
    items: number;
    data: Post[];
}

interface Post {
    id: number;
    title: string;
    content: string;
}

const scrollPagination = (feedId: string) => {
    if (!feedId) {
        console.error('Elements not provided');
        return;
    }

    const feedElement = document.getElementById(feedId);
    const loadingSpinner = document.getElementById("spinner");

    if (!feedElement || !loadingSpinner) {
        console.error('Some element not found in the DOM');
        return;
    }

    fromEvent(document, 'scroll').pipe(
        filter(() => {
            return feedElement.scrollTop + feedElement.clientHeight >= feedElement.scrollHeight - 10;
        }),
        tap(_ => loadingSpinner.style.visibility = 'visible'),
        debounceTime(100),
        startWith(1),
        scan((page: number) => page + 1, 0),
        concatMap((page: number) => 
            ajax(`${apiUrl}?_page=${page}&_per_page=5`).pipe(
                map((ajaxResponse) => ajaxResponse.response as Page),
                catchError(error => {
                    console.error('Error loading page:', error);
                    return of(null);
                })
            )
        ),
        tap(_ => loadingSpinner.style.visibility = 'hidden'),
        filter((page: Page | null) => page !== null),
        takeWhile((page: Page) => page.next !== null, true),
        scan((acc: Feed, curr: Page) => {
            return {
                pages: [...acc.pages, curr],
                currentPage: curr.prev == null ? 1 : curr.prev + 1,
                lastPage: curr.last,
            };
        }, { pages: [], currentPage: 0 } as Feed),
    ).subscribe({
        next: (feed: Feed) => {
            let postsHtml = '';
            console.log('response in next:', feed);
            const lastPage = feed.pages[feed.pages.length - 1];
            if (lastPage) {
                lastPage.data.forEach(post => {
                    postsHtml += `<div class="post">
                        <h3>${post.title}</h3>
                        <p>${post.content}</p>
                    </div>`;
                });
            }
            if (feed.currentPage === feed.lastPage) {
                postsHtml += `<p style="text-align: center;"><em>You have reached the end of the feed.</em></p>`;
            }

            feedElement.innerHTML += postsHtml;
        }
    });
};

// @ts-ignore
window.scrollPagination = scrollPagination;