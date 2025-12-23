const { ajax } = rxjs.ajax;
const { of, fromEvent, switchMap, tap, filter, map,
    BehaviorSubject, timeout, catchError, mergeMap, concatMap } = rxjs;

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

interface UploadResult {
    response: any;
    fileName: string;
}
interface ResponseData {
    type?: string;
    loaded?: number;
    total?: number;
    status?: number;
    fileSize?: number;
    errorMessage?: string;
}

let progressMap = new Map<string, ResponseData>();

const multiUpload = (dropAreaId: string, progressElementId: string) => {
    const renderProgress = (element: HTMLElement, progressMap: Map<string, ResponseData>) => {
        let output = '';
        progressMap.forEach((value, key, _map) => {
            if (value?.type === 'upload_loadstart') {
                output += key + ' loaded ' + value.loaded + '<br />';
            }
            if (value?.type === 'upload_progress') {
                output += key + ' loaded ' + value.loaded + '/' + value.total + '<br />';
            }
            if (value?.type === 'download_load') {
                output += key + ' Finished with status ' + value.status + ' (total ' +  value.fileSize + ' bytes)<br />';
            }
            if (value?.errorMessage) {
                output += key + ' Finished with error ' + value.errorMessage + '<br />';
            }
        });
        element.innerHTML = output;
    };

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
            tap(_ => {
                progressMap.clear();
                progressElement.innerHTML = '';
            }),
            filter((event: DragEvent) => event.dataTransfer && event.dataTransfer.files.length > 0),
            tap((event: DragEvent) => event.preventDefault()),
            map((event: DragEvent) => {
                const fileItems = Array.from(event.dataTransfer!.items).filter((item) => item.kind === "file");
                if (fileItems.some((item) => item.type.startsWith("image/"))) {
                    event.dataTransfer!.dropEffect = "copy";
                } else {
                    event.dataTransfer!.dropEffect = "none";
                }
                return event;
            }),
            map((event: DragEvent) => Array.from(event.dataTransfer!.items).map(file => file.getAsFile())),
            mergeMap((files: File[]) => files.map(file => {
                const formData = new FormData();
                formData.append('file', file, file.name);
                return { formData, fileName: file.name };
            })),
            mergeMap(({ formData, fileName }) => ajax<any>({
                    url: `${apiUrl}`,
                    method: 'POST',
                    body: formData,
                    includeUploadProgress: true,
                }).pipe(
                    map((response): UploadResult => {
                        return {
                            response,
                            fileName
                        }
                    }),
                    catchError(error => {
                        return of({
                            response: {
                                errorMessage: error.message,
                            },
                            fileName,
                        })
                    }),
                ),
            ),
        )
        .subscribe({
            next: ({ response,  fileName }) => {
                progressMap.set(fileName, {
                    ...progressMap.get(fileName),
                    type: response.type,
                    loaded: response.loaded,
                    total: response.total,
                    status: response.status,
                    errorMessage: response.errorMessage,
                });
                if (response?.type === 'upload_load') {
                    progressMap.set(fileName, {
                        ...progressMap.get(fileName),
                        fileSize: response.total,
                    });
                }
                renderProgress(progressElement, progressMap);
            }
        });
};

// @ts-ignore
window.multiUpload = multiUpload;