"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _OverlayWindow_electronWindow, _OverlayWindow_isFocused, _OverlayWindow_willBeFocused, _OverlayWindow_updateOverlayBounds, _OverlayWindow_handler;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverlayWindow = void 0;
const events_1 = require("events");
const path_1 = require("path");
const throttle_debounce_1 = require("throttle-debounce");
const electron_1 = require("electron");
const lib = require('node-gyp-build')((0, path_1.join)(__dirname, '..'));
var EventType;
(function (EventType) {
    EventType[EventType["EVENT_ATTACH"] = 1] = "EVENT_ATTACH";
    EventType[EventType["EVENT_FOCUS"] = 2] = "EVENT_FOCUS";
    EventType[EventType["EVENT_BLUR"] = 3] = "EVENT_BLUR";
    EventType[EventType["EVENT_DETACH"] = 4] = "EVENT_DETACH";
    EventType[EventType["EVENT_FULLSCREEN"] = 5] = "EVENT_FULLSCREEN";
    EventType[EventType["EVENT_MOVERESIZE"] = 6] = "EVENT_MOVERESIZE";
})(EventType || (EventType = {}));
class OverlayWindow extends events_1.EventEmitter {
    static activateOverlay() {
        __classPrivateFieldSet(OverlayWindow, _a, 'overlay', "f", _OverlayWindow_willBeFocused);
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setIgnoreMouseEvents(true, { forward: true });
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).focus();
    }
    static focusTarget() {
        __classPrivateFieldSet(OverlayWindow, _a, 'target', "f", _OverlayWindow_willBeFocused);
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setIgnoreMouseEvents(true, { forward: true });
        lib.focusTarget();
    }
    static attachTo(overlayWindow, targetWindowTitle) {
        if (__classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow)) {
            throw new Error('Library can be initialized only once.');
        }
        else {
            __classPrivateFieldSet(OverlayWindow, _a, overlayWindow, "f", _OverlayWindow_electronWindow);
        }
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).on('blur', () => {
            if (!__classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_isFocused) &&
                __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_willBeFocused) !== 'target') {
                __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).hide();
            }
        });
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).on('focus', () => {
            __classPrivateFieldSet(OverlayWindow, _a, undefined, "f", _OverlayWindow_willBeFocused);
        });
        lib.start(__classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).getNativeWindowHandle(), targetWindowTitle, __classPrivateFieldGet(OverlayWindow, _a, "m", _OverlayWindow_handler));
    }
}
exports.OverlayWindow = OverlayWindow;
_a = OverlayWindow, _OverlayWindow_updateOverlayBounds = function _OverlayWindow_updateOverlayBounds() {
    let lastBounds = OverlayWindow.bounds;
    if (lastBounds.width != 0 && lastBounds.height != 0) {
        if (process.platform === 'win32') {
            lastBounds = electron_1.screen.screenToDipRect(__classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow), OverlayWindow.bounds);
        }
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setBounds(lastBounds);
        if (process.platform === 'win32') {
            // if moved to screen with different DPI, 2nd call to setBounds will correctly resize window
            // dipRect must be recalculated as well
            lastBounds = electron_1.screen.screenToDipRect(__classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow), OverlayWindow.bounds);
            __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setBounds(lastBounds);
        }
    }
}, _OverlayWindow_handler = function _OverlayWindow_handler(e) {
    switch (e.type) {
        case EventType.EVENT_ATTACH:
            OverlayWindow.events.emit('attach', e);
            break;
        case EventType.EVENT_FOCUS:
            OverlayWindow.events.emit('focus', e);
            break;
        case EventType.EVENT_BLUR:
            OverlayWindow.events.emit('blur', e);
            break;
        case EventType.EVENT_DETACH:
            OverlayWindow.events.emit('detach', e);
            break;
        case EventType.EVENT_FULLSCREEN:
            OverlayWindow.events.emit('fullscreen', e);
            break;
        case EventType.EVENT_MOVERESIZE:
            OverlayWindow.events.emit('moveresize', e);
            break;
    }
};
_OverlayWindow_electronWindow = { value: void 0 };
/** Exposed so that apps can get the current bounds of the target */
OverlayWindow.bounds = { x: 0, y: 0, width: 0, height: 0 };
_OverlayWindow_isFocused = { value: false };
_OverlayWindow_willBeFocused = { value: void 0 };
OverlayWindow.events = new events_1.EventEmitter();
OverlayWindow.WINDOW_OPTS = {
    fullscreenable: true,
    skipTaskbar: true,
    frame: false,
    show: false,
    transparent: true,
    // let Chromium to accept any size changes from OS
    resizable: true
};
(() => {
    OverlayWindow.events.on('attach', (e) => {
        __classPrivateFieldSet(OverlayWindow, _a, true, "f", _OverlayWindow_isFocused);
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setIgnoreMouseEvents(true, { forward: true });
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).showInactive();
        if (process.platform === 'linux') {
            __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setSkipTaskbar(true);
        }
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setAlwaysOnTop(true, 'screen-saver');
        if (e.isFullscreen !== undefined) {
            __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setFullScreen(e.isFullscreen);
        }
        OverlayWindow.bounds = e;
        __classPrivateFieldGet(OverlayWindow, _a, "m", _OverlayWindow_updateOverlayBounds).call(OverlayWindow);
    });
    OverlayWindow.events.on('fullscreen', (e) => {
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setFullScreen(e.isFullscreen);
    });
    OverlayWindow.events.on('detach', () => {
        __classPrivateFieldSet(OverlayWindow, _a, false, "f", _OverlayWindow_isFocused);
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).hide();
    });
    const dispatchMoveresize = (0, throttle_debounce_1.throttle)(1 /* 30fps */, __classPrivateFieldGet(OverlayWindow, _a, "m", _OverlayWindow_updateOverlayBounds));
    OverlayWindow.events.on('moveresize', (e) => {
        OverlayWindow.bounds = e;
        dispatchMoveresize();
    });
    OverlayWindow.events.on('blur', () => {
        __classPrivateFieldSet(OverlayWindow, _a, false, "f", _OverlayWindow_isFocused);
        if (__classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_willBeFocused) !== 'overlay' && !__classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).isFocused()) {
            __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).hide();
        }
    });
    OverlayWindow.events.on('focus', () => {
        __classPrivateFieldSet(OverlayWindow, _a, undefined, "f", _OverlayWindow_willBeFocused);
        __classPrivateFieldSet(OverlayWindow, _a, true, "f", _OverlayWindow_isFocused);
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setIgnoreMouseEvents(true, { forward: true });
        if (!__classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).isVisible()) {
            __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).showInactive();
            if (process.platform === 'linux') {
                __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setSkipTaskbar(true);
            }
            __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setAlwaysOnTop(true, 'screen-saver');
        }
    });
})();
//# sourceMappingURL=index.js.map