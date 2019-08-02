import { DotDevice } from '../dot-device/dot-device.model';
import { DotPersona } from '../dot-persona/dot-persona.model';
import { PageMode } from '@portlets/dot-edit-page/shared/models/page-mode.enum';

export interface DotEditPageViewAs {
    persona?: DotPersona;
    language?: number;
    device?: DotDevice;
    mode: PageMode;
}
