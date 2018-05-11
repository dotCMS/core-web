import { DotAddContentletService, DotAddContentLet } from './dot-add-contentlet.service';
import { DOTTestBed } from '../../../../test/dot-test-bed';

describe('DotAddContentletService', () => {
    const load = () => {};
    const keyDown = () => {};
    let service: DotAddContentletService;
    let injector;

    beforeEach(() => {
        injector = DOTTestBed.configureTestingModule({
            providers: [DotAddContentletService]
        });

        service = injector.get(DotAddContentletService);
    });

    it('should set data', () => {
        service.action$.subscribe((data: DotAddContentLet) => {
            expect(data).toEqual({
                type: 'content',
                container: '123',
                load: load,
                keyDown: keyDown
            });
        });

        service.add({
            type: 'content',
            container: '123',
            load: load,
            keyDown: keyDown
        });
    });

    it('should clear data', () => {
        service.action$.subscribe((data: DotAddContentLet) => {
            expect(data).toEqual(null);
        });

        service.clear();

        expect(service.load).toEqual(null);
        expect(service.keyDown).toEqual(null);
    });
});
