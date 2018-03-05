import { Observable } from 'rxjs/Observable';
import { DotPersona } from '../shared/models/dot-persona/dot-persona.model';

export class DotPersonasServiceMock {
    get(): Observable<DotPersona[]> {
        return Observable.of([
            {
                description: 'A non-US based investor interested in global financial news and services',
                folder: 'SYSTEM_FOLDER',
                host: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                identifier: '1c56ba62-1f41-4b81-bd62-b6eacff3ad23',
                inode: 'f30e6dc9-e951-4f71-bb1c-a98b49238806',
                keyTag: 'GlobalInvestor',
                languageId: 1,
                lastReview: '2016-02-19 11:21:03.788',
                modDate: '2016-02-19 11:21:03.802',
                modUser: 'dotcms.org.1',
                name: 'Global Investor',
                owner: 'dotcms.org.1',
                photoContentAsset: '1c56ba62-1f41-4b81-bd62-b6eacff3ad23/photo',
                sortOrder: 0,
                stInode: 'c938b15f-bcb6-49ef-8651-14d455a97045',
            }
        ]);
    }
}
