import { DotDevicesService } from './dot-devices.service';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { DotDevice } from '../../../shared/models/dot-device/dot-device.model';

describe('DotDevicesService', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([DotDevicesService]);
        this.dotDevicesService = this.injector.get(DotDevicesService);
    });

    it('should get Devices', () => {
        this.dotDevicesService.get().subscribe((devices: DotDevice[]) => {
            expect(devices).toEqual([
                { id: '0', label: 'Desktop', width: '100%', height: '100%' },
                { id: '1', label: 'iPhone', width: '375px', height: '667px' },
                { id: '2', label: 'iPad Pro', width: '1024px', height: '1366px' },
                { id: '3', label: 'iPad 3, 4, Air, Air2', width: '768px', height: '1024px' }
            ]);
        });
    });
});
