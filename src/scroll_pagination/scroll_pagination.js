var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var ajax = rxjs.ajax.ajax;
var of = rxjs.of, fromEvent = rxjs.fromEvent, tap = rxjs.tap, filter = rxjs.filter, map = rxjs.map, timeout = rxjs.timeout, catchError = rxjs.catchError, concatMap = rxjs.concatMap, scan = rxjs.scan, startWith = rxjs.startWith, takeWhile = rxjs.takeWhile, debounceTime = rxjs.debounceTime;
var apiUrl = 'http://localhost:3000/posts';
var scrollPagination = function (feedId) {
    if (!feedId) {
        console.error('Elements not provided');
        return;
    }
    var feedElement = document.getElementById(feedId);
    var loadingSpinner = document.getElementById("spinner");
    if (!feedElement || !loadingSpinner) {
        console.error('Some element not found in the DOM');
        return;
    }
    fromEvent(document, 'scroll').pipe(
    /*
    filter(() => {
        return feedElement.scrollTop + feedElement.clientHeight >= feedElement.scrollHeight - 10;
    }),
    tap(_ => loadingSpinner.style.visibility = 'visible'),
    debounceTime(100),
    */
    startWith(1), scan(function (page) { return page + 1; }, 0), map(function (page) { return ({
        prev: null,
        next: 2,
        data: [
            { id: page, title: "title ".concat(page, ".1"), content: "content ".concat(page, ".1") },
            { id: page + 1, title: "title ".concat(page, ".2"), content: "content ".concat(page, ".2") },
            { id: page + 2, title: "title ".concat(page, ".3"), content: "content ".concat(page, ".3") },
        ],
        last: 5
    }); }), 
    /*
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
    */
    scan(function (acc, curr) {
        return {
            pages: __spreadArray(__spreadArray([], acc.pages, true), [curr], false),
            currentPage: curr.prev == null ? 1 : curr.prev + 1,
            lastPage: curr.last,
        };
    }, { pages: [], currentPage: 0 })).subscribe({
        next: function (feed) {
            var postsHtml = '';
            console.log('response in next:', feed);
            var lastPage = feed.pages[feed.pages.length - 1];
            if (lastPage) {
                lastPage.data.forEach(function (post) {
                    postsHtml += "<div class=\"post\">\n                        <h3>".concat(post.title, "</h3>\n                        <p>").concat(post.content, "</p>\n                    </div>");
                });
            }
            if (feed.currentPage === feed.lastPage) {
                postsHtml += "<p style=\"text-align: center;\"><em>You have reached the end of the feed.</em></p>";
            }
            feedElement.innerHTML += postsHtml;
        }
    });
};
// @ts-ignore
window.scrollPagination = scrollPagination;
