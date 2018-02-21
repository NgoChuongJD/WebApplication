import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

/**
 * The service to handle show/hide the progress bar at the top of page
 */
@Injectable()
export class ProgressBarService {
    private source: Subject<boolean> = new Subject<boolean>();

    /**
     * 
     */
    progressObservable = this.source.asObservable();

    /**
     * Rises the show-signal
     */
    show(): void {
        this.source.next(true);
    }

    /**
     * Rises the hide-signal
     */
    hide(): void {
        this.source.next(false);
    }
}