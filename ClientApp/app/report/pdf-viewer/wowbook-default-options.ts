import { InjectionToken } from '@angular/core';

export interface WowbookDefaultOptions {
    fullscreenElement: HTMLElement,
    zoomMax: number,
    height: number,
    width: number,
    centeredWhenClosed: boolean,
    hardcovers: boolean,
    pageNumbers: boolean,
    // toolbar: "lastLeft, left, right, lastRight, toc, find, zoomin, zoomout, fullscreen, download, share",
    toolbar: string,
    //thumbnailsPosition: 'left',
    containerPadding: string,
    pdf: string,
    pdfFind: boolean,
    pdfTextSelectable: boolean,
    flipSound: boolean,
    //container: HTMLElement,
    controls: {},
    turnPageDuration: number,
    turnPageDurationMin: number,
    responsive: boolean,
    container: HTMLElement
}

export interface WowbookApiCommands {
    next: string,
    prev: string,
    zoomIn: string,
    zoomOut: string,
    zoomReset: string,
    gotoPage: string,
    gotoLeft: string,
    gotoRight: string,
    gotoLastLeft: string,
    gotoLastRight: string,
    toggleSlideShow: string,
    toggleFlipSound: string,
    toggleThumbnails: string,
    toggleFullscreen: string,
    toggleToc: string
}



export const WOWBOOK_DEFAULT_OPTIONS = new InjectionToken<WowbookDefaultOptions>('wowbook-default-options'); 
export const WOWBOOK_DEFAULT_COMMANDS = new InjectionToken<WowbookApiCommands>('wowbook-default-commands'); 