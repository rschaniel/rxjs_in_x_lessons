"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageGallery = void 0;
var rxjs_1 = require("rxjs");
var imageGallery = function (containerId) {
    if (!containerId) {
        console.error('Elements not provided');
        return;
    }
    var containerElement = document.getElementById(containerId);
    var imagesContainer = containerElement === null || containerElement === void 0 ? void 0 : containerElement.querySelector("#images");
    var forwardButton = containerElement === null || containerElement === void 0 ? void 0 : containerElement.querySelector("#forward");
    var backwardButton = containerElement === null || containerElement === void 0 ? void 0 : containerElement.querySelector("#back");
    var terminateButton = containerElement === null || containerElement === void 0 ? void 0 : containerElement.querySelector("#terminate");
    if (!containerElement || !imagesContainer || !forwardButton || !backwardButton || !terminateButton) {
        console.error('Some element not found in the DOM');
        return;
    }
    var imagesSrcs = [
        'https://picsum.photos/id/1015/600/400',
        'https://picsum.photos/id/1016/600/400',
        'https://picsum.photos/id/1018/600/400',
        'https://picsum.photos/id/1020/600/400',
        'https://picsum.photos/id/1024/600/400',
        'https://picsum.photos/id/1027/600/400',
    ];
    var terminate$ = (0, rxjs_1.fromEvent)(terminateButton, 'click').pipe((0, rxjs_1.take)(1));
    var hover$ = (0, rxjs_1.merge)((0, rxjs_1.fromEvent)(imagesContainer, 'mouseenter').pipe((0, rxjs_1.map)(function () { return true; })), (0, rxjs_1.fromEvent)(imagesContainer, 'mouseleave').pipe((0, rxjs_1.map)(function () { return false; }))).pipe((0, rxjs_1.takeUntil)(terminate$), (0, rxjs_1.startWith)(false), (0, rxjs_1.shareReplay)(1));
    var autoAdvance$ = hover$.pipe((0, rxjs_1.switchMap)(function (isHovering) {
        return isHovering ? rxjs_1.EMPTY : (0, rxjs_1.interval)(3000);
    }), (0, rxjs_1.map)(function () { return 'auto'; }));
    var forward$ = (0, rxjs_1.fromEvent)(forwardButton, 'click').pipe((0, rxjs_1.takeUntil)(terminate$), (0, rxjs_1.switchMap)(function () { return (0, rxjs_1.concat)((0, rxjs_1.of)('forward'), (0, rxjs_1.timer)(3000).pipe((0, rxjs_1.map)(function () { return 'auto'; }))); }));
    var back$ = (0, rxjs_1.fromEvent)(backwardButton, 'click').pipe((0, rxjs_1.takeUntil)(terminate$), (0, rxjs_1.switchMap)(function () { return (0, rxjs_1.concat)((0, rxjs_1.of)('back'), (0, rxjs_1.timer)(3000).pipe((0, rxjs_1.map)(function () { return 'auto'; }))); }));
    var subscription = (0, rxjs_1.merge)(autoAdvance$, forward$, back$).pipe((0, rxjs_1.withLatestFrom)(hover$), (0, rxjs_1.takeUntil)(terminate$), (0, rxjs_1.filter)(function (_a) {
        var event = _a[0], isHovering = _a[1];
        return event !== 'auto' || !isHovering;
    }), (0, rxjs_1.map)(function (_a) {
        var event = _a[0];
        return event;
    }), (0, rxjs_1.scan)(function (index, event) {
        if (event === 'forward') {
            return (index + 1) % imagesSrcs.length;
        }
        else if (event === 'back') {
            return (index - 1 + imagesSrcs.length) % imagesSrcs.length;
        }
        else { // 'auto'
            return (index + 1) % imagesSrcs.length;
        }
    }, 0), (0, rxjs_1.tap)(function (index) {
        var img = imagesContainer === null || imagesContainer === void 0 ? void 0 : imagesContainer.querySelector("img");
        if (img) {
            img.src = imagesSrcs[index];
        }
    })).subscribe();
    return subscription;
};
exports.imageGallery = imageGallery;
