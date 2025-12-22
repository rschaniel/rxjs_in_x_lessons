const { ajax } = rxjs.ajax;
const { fromEvent, switchMap, debounceTime, distinctUntilChanged, tap, pluck, filter, map, startWith,
    BehaviorSubject, timeout, catchError, retry } = rxjs;

const apiUrl = 'http://localhost:3030/upload';


const displayError = (errorMessage: string) => {
    const errorContainer = document.getElementById('errors');

    if (errorContainer) {
        errorContainer.innerHTML = '<p>' + errorMessage + '</p>';
    }
};
const clearErrors = () => {
    displayError('');
};

const multiUpload = (dropAreaId: string, progressElementId: string) => {
    if (!dropAreaId || !progressElementId) {
        console.error('Elements not provided');
        return;
    }

    const dropArea = document.getElementById(dropAreaId);
    const progressElement = document.getElementById(progressElementId);

    if (!dropArea || !progressElement) {
        console.error('Some element not found in the DOM');
        return;
    }

    fromEvent(dropArea, 'dragover').pipe(tap((e: DragEvent) => e.preventDefault())).subscribe();
    fromEvent(dropArea, 'drop')
        .pipe(
            tap(_ => progressElement.innerHTML = ''),
            filter((event: DragEvent) => event.dataTransfer && event.dataTransfer.files.length > 0),
            tap((event: DragEvent) => {
                event.preventDefault();
                const fileItems = Array.from(event.dataTransfer!.items).filter(
                    (item) => item.kind === "file",
                );
                if (fileItems.some((item) => item.type.startsWith("image/"))) {
                    event.dataTransfer!.dropEffect = "copy";
                } else {
                    event.dataTransfer!.dropEffect = "none";
                }
            }),
            map((event: DragEvent) => Array.from(event.dataTransfer!.items).map(file => file.getAsFile())),
            map((files) => {
                const formData = new FormData();
                files.forEach((file, index) => formData.append('file' + index, file, file.name ?? 'file' + index));
                return formData;
            }),
            switchMap(formData => ajax<any>({
                    url: `${apiUrl}`,
                    method: 'POST',
                    body: formData,
                    includeUploadProgress: true,
                }),
            ),
            catchError(error => {
                console.error(error);
                displayError(error);
                return [];
            })
        )
        .subscribe({
            next: (response) => {
                console.dir(response);
                let output = '';
                if (response.type === 'upload_loadstart') {
                    output = 'Loaded ' + response.loaded;
                }
                if (response.type === 'upload_progress') {
                    output = 'Loaded ' + response.loaded + '/' + response.total;
                }
                if (response.type === 'download_load') {
                    output = 'Finished with status ' + response.status;
                }
                progressElement.innerHTML = output;
            }
        });
};

// @ts-ignore
window.multiUpload = multiUpload;