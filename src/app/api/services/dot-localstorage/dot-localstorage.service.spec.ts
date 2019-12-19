import { TestBed } from '@angular/core/testing';

import { DotLocalstorageService } from './dot-localstorage.service';

describe('DotLocalstorageService', () => {
    let service: DotLocalstorageService;
    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.get(DotLocalstorageService);
    });

    describe('setItem', () => {
        beforeEach(() => {
            spyOn(window.localStorage, 'setItem');
        });

        it('should set string', () => {
            service.setItem<string>('hello', 'world');
            expect(window.localStorage.setItem).toHaveBeenCalledWith('hello', 'world');
        });

        it('should set object', () => {
            service.setItem<{
                [key: string]: string;
            }>('hello', {
                hola: 'mundo'
            });
            expect(window.localStorage.setItem).toHaveBeenCalledWith('hello', '{"hola":"mundo"}');
        });
    });

    describe('getItem', () => {
        it('should get string', () => {
            spyOn(window.localStorage, 'getItem').and.returnValue('Hola Mundo');

            const result = service.getItem<string>('hello');
            expect(window.localStorage.getItem).toHaveBeenCalledWith('hello');
            expect(result).toBe('Hola Mundo');
        });

        it('should get an array', () => {
            spyOn(window.localStorage, 'getItem').and.returnValue('["1", "2"]');

            const result = service.getItem<string[]>('hello');
            expect(window.localStorage.getItem).toHaveBeenCalledWith('hello');
            expect(result).toEqual(['1', '2']);
        });

        it('should get a boolean', () => {
            spyOn(window.localStorage, 'getItem').and.returnValue('true');

            const result = service.getItem<boolean>('hello');
            expect(window.localStorage.getItem).toHaveBeenCalledWith('hello');
            expect(result).toEqual(true);
        });
    });

    describe('removeItem', () => {
        beforeEach(() => {
            spyOn(window.localStorage, 'removeItem');
        });

        it('should remove', () => {
            service.removeItem('hello');
            expect(window.localStorage.removeItem).toHaveBeenCalledWith('hello');
        });
    });

    describe('clear', () => {
        beforeEach(() => {
            spyOn(window.localStorage, 'clear');
        });

        it('should clean', () => {
            service.clear();
            expect(window.localStorage.clear).toHaveBeenCalledTimes(1);
        });
    });

    describe('listen', () => {
        it('should listen', () => {
            service.listen('hola').subscribe((res: string) => {
                expect(res).toBe('this is the new value');
            });
            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: 'hola',
                    newValue: 'this is the new value'
                })
            );
        });
    });
});
