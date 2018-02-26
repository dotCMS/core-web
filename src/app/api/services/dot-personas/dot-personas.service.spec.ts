import { DotPersonasService } from './dot-personas.service';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { Persona } from '../../../shared/models/persona/persona.model';

describe('DotPersonasService', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([DotPersonasService]);
        this.dotPersonasService = this.injector.get(DotPersonasService);
    });

    it('should get Languages', () => {
        this.dotPersonasService.get().subscribe((personas: Persona[]) => {
            expect(personas).toEqual([
                { id: '1', label: 'Admin' },
                { id: '2', label: 'Wealthy Prospect' },
                { id: '3', label: 'Global Investor' },
                { id: '4', label: 'First Time investor' }
            ]);
        });
    });
});
