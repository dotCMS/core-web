import { DotLanguagesService } from './dot-languages.service';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { Language } from '../../../shared/models/language/language.model';

describe('DotLanguagesService', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([DotLanguagesService]);
        this.dotLanguagesService = this.injector.get(DotLanguagesService);
    });

    it('should get Languages', () => {
        this.dotLanguagesService.get().subscribe((languages: Language[]) => {
            expect(languages).toEqual([
                { id: 'en', label: 'English' },
                { id: 'es', label: 'Spanish' },
                { id: 'fr', label: 'French' }
            ]);
        });
    });
});
