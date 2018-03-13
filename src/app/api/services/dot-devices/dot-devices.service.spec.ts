import { DotDevicesService } from './dot-devices.service';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { DotDevice } from '../../../shared/models/dot-device/dot-device.model';
import { ConnectionBackend, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

fdescribe('DotDevicesService', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([DotDevicesService]);
        this.dotDevicesService = this.injector.get(DotDevicesService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => (this.lastConnection = connection));
    });

    it('should get Devices', () => {
        let result;

        this.dotDevicesService.get().subscribe(res => {
            result = res;
        });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: {
                        contentlets: [{ cssHeight: '100', cssWidth: '200', name: 'iphone' }]
                    }
                })
            )
        );

        this.dotDevicesService.get().subscribe((devices: DotDevice[]) => {
            expect(devices).toEqual([{ cssHeight: '100', cssWidth: '200', name: 'iphone' }]);
        });
    });
});
