var ajax = rxjs.ajax.ajax;
var fromEvent = rxjs.fromEvent, switchMap = rxjs.switchMap, debounceTime = rxjs.debounceTime, distinctUntilChanged = rxjs.distinctUntilChanged, tap = rxjs.tap, pluck = rxjs.pluck, filter = rxjs.filter, map = rxjs.map, startWith = rxjs.startWith, BehaviorSubject = rxjs.BehaviorSubject, timeout = rxjs.timeout, catchError = rxjs.catchError, retry = rxjs.retry;
var apiUrl = 'http://localhost:3030/upload';
var displayError = function (errorMessage) {
    var errorContainer = document.getElementById('errors');
    if (errorContainer) {
        errorContainer.innerHTML = '<p>' + errorMessage + '</p>';
    }
};
var clearErrors = function () {
    displayError('');
};
var multiUpload = function (dropAreaId, progressElementId) {
    if (!dropAreaId || !progressElementId) {
        console.error('Elements not provided');
        return;
    }
    var dropArea = document.getElementById(dropAreaId);
    var progressElement = document.getElementById(progressElementId);
    if (!dropArea || !progressElement) {
        console.error('Some element not found in the DOM');
        return;
    }
    fromEvent(dropArea, 'dragover').pipe(tap(function (e) { return e.preventDefault(); })).subscribe();
    fromEvent(dropArea, 'drop')
        .pipe(tap(function (_) { return progressElement.innerHTML = ''; }), filter(function (event) { return event.dataTransfer && event.dataTransfer.files.length > 0; }), tap(function (event) {
        event.preventDefault();
        var fileItems = Array.from(event.dataTransfer.items).filter(function (item) { return item.kind === "file"; });
        if (fileItems.some(function (item) { return item.type.startsWith("image/"); })) {
            event.dataTransfer.dropEffect = "copy";
        }
        else {
            event.dataTransfer.dropEffect = "none";
        }
    }), map(function (event) { return Array.from(event.dataTransfer.items).map(function (file) { return file.getAsFile(); }); }), map(function (files) {
        var formData = new FormData();
        files.forEach(function (file, index) { var _a; return formData.append('file' + index, file, (_a = file.name) !== null && _a !== void 0 ? _a : 'file' + index); });
        return formData;
    }), switchMap(function (formData) { return ajax({
        url: "".concat(apiUrl),
        method: 'POST',
        body: formData,
        includeUploadProgress: true,
    }); }), catchError(function (error) {
        console.error(error);
        displayError(error);
        return [];
    }))
        .subscribe({
        next: function (response) {
            console.dir(response);
            var output = '';
            if (response.type === 'upload_loadstart') {
                output = 'Loaded ' + response.loaded;
            }
            if (response.type === 'upload_progress') {
                output = 'Loaded ' + response.loaded + '/' + response.total;
            }
            if (response.type === 'download_load') {
                output = 'Finished with status ' + response.status;
            }
            progressElement.insertAdjacentHTML('beforeend', output + '<br />');
        }
    });
};
// @ts-ignore
window.multiUpload = multiUpload;
