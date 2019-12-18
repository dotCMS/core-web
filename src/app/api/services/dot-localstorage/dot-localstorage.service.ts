import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DotLocalstorageService {
    constructor() {}

    /**
     * Save an item to localstorage
     *
     * @template T
     * @param {string} key
     * @param {(T | string | number)} value
     * @memberof DotLocalstorageService
     */
    setItem<T>(key: string, value: T | string | number): void {
        let data;

        if (typeof value === 'object') {
            data = JSON.stringify(value);
        } else {
            data = value;
        }

        localStorage.setItem(key, data);
    }

    /**
     * Get an item from localstorage
     *
     * @template T
     * @param {string} key
     * @returns {(T | string | number)}
     * @memberof DotLocalstorageService
     */
    getItem<T>(key: string): T | string | number {
        const item = localStorage.getItem(key);

        const isNumber: number = parseInt(item, 0);
        if (isNumber) {
            return isNumber;
        }

        try {
            return JSON.parse(item);
        } catch {
            return item;
        }
    }

    /**
     * Remove an item form the localstorage
     *
     * @param {string} key
     * @memberof DotLocalstorageService
     */
    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    /**
     * Remove all items from localstorage
     *
     * @memberof DotLocalstorageService
     */
    clear(): void {
        localStorage.clear();
    }

    subscribe() {
        return fromEvent(window, 'storage').pipe(map((e: StorageEvent) => e.newValue === 'true'));
    }
}
