var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var ajax = rxjs.ajax.ajax;
var of = rxjs.of, fromEvent = rxjs.fromEvent, switchMap = rxjs.switchMap, tap = rxjs.tap, filter = rxjs.filter, map = rxjs.map, BehaviorSubject = rxjs.BehaviorSubject, timeout = rxjs.timeout, catchError = rxjs.catchError, mergeMap = rxjs.mergeMap;
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
var progressMap = new Map();
var multiUpload = function (dropAreaId, progressElementId) {
    var renderProgress = function (element, progressMap) {
        var output = '';
        progressMap.forEach(function (value, key, _map) {
            if ((value === null || value === void 0 ? void 0 : value.type) === 'upload_loadstart') {
                output += key + ' loaded ' + value.loaded + '<br />';
            }
            if ((value === null || value === void 0 ? void 0 : value.type) === 'upload_progress') {
                output += key + ' loaded ' + value.loaded + '/' + value.total + '<br />';
            }
            if ((value === null || value === void 0 ? void 0 : value.type) === 'download_load') {
                output += key + ' Finished with status ' + value.status + ' (total ' + value.fileSize + ' bytes)<br />';
            }
            if (value === null || value === void 0 ? void 0 : value.errorMessage) {
                output += key + ' Finished with error ' + value.errorMessage + '<br />';
            }
        });
        element.innerHTML = output;
    };
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
        .pipe(tap(function (_) {
        progressMap.clear();
        progressElement.innerHTML = '';
    }), filter(function (event) { return event.dataTransfer && event.dataTransfer.files.length > 0; }), tap(function (event) {
        event.preventDefault();
        var fileItems = Array.from(event.dataTransfer.items).filter(function (item) { return item.kind === "file"; });
        if (fileItems.some(function (item) { return item.type.startsWith("image/"); })) {
            event.dataTransfer.dropEffect = "copy";
        }
        else {
            event.dataTransfer.dropEffect = "none";
        }
    }), map(function (event) { return Array.from(event.dataTransfer.items).map(function (file) { return file.getAsFile(); }); }), mergeMap(function (files) { return files.map(function (file) { return file; }); }), map(function (file) {
        var formData = new FormData();
        formData.append('file', file, file.name);
        return { formData: formData, fileName: file.name };
    }), mergeMap(function (_a) {
        var formData = _a.formData, fileName = _a.fileName;
        return ajax({
            url: "".concat(apiUrl),
            method: 'POST',
            body: formData,
            includeUploadProgress: true,
        }).pipe(map(function (response) {
            return {
                response: response,
                fileName: fileName
            };
        }), catchError(function (error) {
            return of({
                response: {
                    errorMessage: error.message,
                },
                fileName: fileName,
            });
        }));
    }))
        .subscribe({
        next: function (_a) {
            var response = _a.response, fileName = _a.fileName;
            progressMap.set(fileName, __assign(__assign({}, progressMap.get(fileName)), { type: response.type, loaded: response.loaded, total: response.total, status: response.status, errorMessage: response.errorMessage }));
            if ((response === null || response === void 0 ? void 0 : response.type) === 'upload_load') {
                progressMap.set(fileName, __assign(__assign({}, progressMap.get(fileName)), { fileSize: response.total }));
            }
            renderProgress(progressElement, progressMap);
        }
    });
};
// @ts-ignore
window.multiUpload = multiUpload;
