import { DotTemplateContainersCacheService } from './dot-template-containers-cache.service';
import { TestBed } from '@angular/core/testing';
import { DotContainer } from '../../shared/models/container/dot-container.model';

describe('TemplateContainersCacheService', () => {
    let service: DotTemplateContainersCacheService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DotTemplateContainersCacheService],
            imports: [  ]
        });

        service = TestBed.get(DotTemplateContainersCacheService);
    });


    it('should return the right container', () => {
        const containers = {
            '1': {
                container: {
                    identifier: '1',
                    name: 'container 1',
                    type: 'type'
                },
            },
            '2': {
                container: {
                    identifier: '2',
                    name: 'container 2',
                    type: 'type'
                }
            }
        };

        service.set(containers);

        expect(service.get('1')).toEqual(containers[1].container);
        expect(service.get('2')).toEqual(containers[2].container);
        expect(service.get('3')).toBeNull();
    });
});
