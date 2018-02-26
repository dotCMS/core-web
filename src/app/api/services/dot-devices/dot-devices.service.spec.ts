import { DotDevicesService } from './dot-devices.service';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { Device } from '../../../shared/models/device/device.model';

describe('DotDevicesService', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([DotDevicesService]);
        this.dotDevicesService = this.injector.get(DotDevicesService);
    });

    it('should get Devices', () => {
        this.dotDevicesService.get().subscribe((devices: Device[]) => {
            expect(devices).toEqual([
                { id: '0', label: 'Desktop', width: 'auto', height: 'auto' },
                { id: '1', label: 'iPhone', width: '375px', height: '667px' },
                { id: '2', label: 'iPad Pro', width: '1024px', height: '1366px' },
                { id: '3', label: 'iPad 3, 4, Air, Air2', width: '768px', height: '1024px' }
            ]);
        });
    });
});
