import { DotDialogService } from './dot-dialog.service';
import { DOTTestBed } from '../../../test/dot-test-bed';

describe('DotDialogService', () => {
    let mockData;
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([DotDialogService]);

        mockData = {
            footerLabel: {
                acceptLabel: 'Delete',
                rejectLabel: 'Reject'
            }
        };

        this.dotDialogService = this.injector.get(DotDialogService);
    });

    it('should emit data to labels property', () => {
        this.dotDialogService.confirm(mockData);

        this.dotDialogService.labels.subscribe((message) => {
            expect(message).toEqual({
                acceptLabel: 'Delete',
                rejectLabel: 'Reject'
            });
        });
    });

    it('should call confirmation service with data parameter', () => {
        spyOn(this.dotDialogService.confirmationService, 'confirm');

        this.dotDialogService.confirm(mockData);

        expect(this.dotDialogService.confirmationService.confirm).toHaveBeenCalledWith(mockData);
    });
});
