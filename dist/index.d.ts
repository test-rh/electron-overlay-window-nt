/// <reference types="node" />
import { EventEmitter } from 'events';
import type { BrowserWindow, Rectangle, BrowserWindowConstructorOptions } from 'electron';
export interface AttachEvent {
    hasAccess: boolean | undefined;
    isFullscreen: boolean | undefined;
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface FullscreenEvent {
    isFullscreen: boolean;
}
export interface MoveresizeEvent {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare class OverlayWindow extends EventEmitter {
    #private;
    /** Exposed so that apps can get the current bounds of the target */
    static bounds: Rectangle;
    static readonly events: EventEmitter;
    static readonly WINDOW_OPTS: BrowserWindowConstructorOptions;
    static activateOverlay(): void;
    static focusTarget(): void;
    static attachTo(overlayWindow: BrowserWindow, targetWindowTitle: string): void;
}
