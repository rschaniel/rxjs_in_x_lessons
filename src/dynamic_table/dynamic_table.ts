import {
    fromEvent,
    tap,
    ReplaySubject,
    delay
} from 'rxjs';

const FEATURES = [
    { id: 'A', name: 'Feature A' },
    { id: 'B', name: 'Feature B' },
    { id: 'C', name: 'Feature C' },
    { id: 'D', name: 'Feature D' },
];

const createAccordionCell = (featureId: string, featureName: string, productName: string): string => {
    return `
        <div class="accordion">
            <div class="accordion-header" data-feature="${featureId}">${featureName}</div>
            <div class="accordion-content">
                <p class="accordion-text">Details of ${featureName} for ${productName}</p>
            </div>
        </div>
    `;
};

const dynamicTable = (tableId: string) => {
    if (!tableId) {
        console.error('Elements not provided');
        return;
    }

    const tableElement = document.getElementById(tableId);
    const addProductButton = document.getElementById("addProduct");

    if (!tableElement) {
        console.error('Some element not found in the DOM');
        return;
    }

    let productCount = 2; // Start with Product 1 and Product 2

    // ReplaySubject to store all toggle actions with infinite buffer
    interface FeatureAction {
        featureId: string;
        isOpen: boolean;
    }
    const featureActions$ = new ReplaySubject<FeatureAction>(Infinity);

    // Pure synchronous functions for DOM operations
    const removeAndCloneHeaders = (): HTMLElement[] => {
        const headers = Array.from(tableElement.querySelectorAll('.accordion-header'));
        headers.forEach((header) => {
            const newHeader = header.cloneNode(true) as HTMLElement;
            header.parentNode?.replaceChild(newHeader, header);
        });
        return Array.from(tableElement.querySelectorAll('.accordion-header'));
    };

    const toggleFeatureInAllColumns = (featureId: string, isOpen: boolean) => {
        tableElement.querySelectorAll(`[data-feature="${featureId}"]`).forEach((h) => {
            const accordion = h.closest('.accordion');
            const content = accordion?.querySelector('.accordion-content');

            if (isOpen) {
                h.classList.add('open');
                if (content) content.classList.add('open');
            } else {
                h.classList.remove('open');
                if (content) content.classList.remove('open');
            }
        });
    };

    const toggleFeatureInColumn = (columnIndex: number, featureId: string, isOpen: boolean) => {
        const rows = tableElement.querySelectorAll('tbody tr');
        rows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            const cell = cells[columnIndex];
            if (!cell) return;

            const header = cell.querySelector(`[data-feature="${featureId}"]`)?.closest('.accordion')?.querySelector('.accordion-header');
            const content = cell.querySelector(`[data-feature="${featureId}"]`)?.closest('.accordion')?.querySelector('.accordion-content');

            if (!header || !content) return;

            if (isOpen) {
                header.classList.add('open');
                content.classList.add('open');
            } else {
                header.classList.remove('open');
                content.classList.remove('open');
            }
        });
    };

    const addProductColumn = (productName: string): number => {
        const thead = tableElement.querySelector('thead tr');
        const tbody = tableElement.querySelector('tbody');

        if (!thead || !tbody) return -1;

        const newTh = document.createElement('th');
        newTh.textContent = productName;
        thead.appendChild(newTh);

        const newColumnIndex = thead.querySelectorAll('th').length - 1;

        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row, rowIndex) => {
            const feature = FEATURES[rowIndex];
            const newTd = document.createElement('td');
            newTd.innerHTML = createAccordionCell(feature.id, feature.name, productName);
            row.appendChild(newTd);
        });

        return newColumnIndex;
    };

    // Initial setup of click handlers
    removeAndCloneHeaders().forEach((header) => {
        fromEvent(header, 'click').pipe(
            tap(() => {
                const featureId = header.getAttribute('data-feature') || '';
                const isCurrentlyOpen = header.classList.contains('open');
                const newIsOpen = !isCurrentlyOpen;

                featureActions$.next({
                    featureId,
                    isOpen: newIsOpen
                });

                toggleFeatureInAllColumns(featureId, newIsOpen);
            })
        ).subscribe();
    });

    // Handle add product button click
    if (addProductButton) {
        fromEvent(addProductButton, 'click').pipe(
            tap(() => {
                productCount++;
                const productName = `Product ${productCount}`;
                const newColumnIndex = addProductColumn(productName);

                if (newColumnIndex === -1) return;

                // Re-setup click handlers for all headers
                removeAndCloneHeaders().forEach((header) => {
                    fromEvent(header, 'click').pipe(
                        tap(() => {
                            const featureId = header.getAttribute('data-feature') || '';
                            const isCurrentlyOpen = header.classList.contains('open');
                            const newIsOpen = !isCurrentlyOpen;

                            featureActions$.next({
                                featureId,
                                isOpen: newIsOpen
                            });

                            toggleFeatureInAllColumns(featureId, newIsOpen);
                        })
                    ).subscribe();
                });

                // Replay all actions to the new column
                featureActions$.pipe(
                    delay(100),
                    tap(({ featureId, isOpen }) => {
                        toggleFeatureInColumn(newColumnIndex, featureId, isOpen);
                    })
                ).subscribe();
            })
        ).subscribe();
    }
};

export { dynamicTable };