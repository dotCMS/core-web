import { DotMessagePipe } from './dot-message.pipe';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { DotMessageService } from '@services/dot-messages-service';

describe('DotMessagePipe', () => {
    let messageServiceMock: MockDotMessageService;
    let pipe: DotMessagePipe;
    beforeEach(() => {
        messageServiceMock = new MockDotMessageService({
            'apps.search.placeholder': 'Search'
        });
        pipe = new DotMessagePipe((messageServiceMock as unknown) as DotMessageService);
    });

    it('should return message requested', () => {
        expect(pipe.transform('apps.search.placeholder')).toEqual('Search');
    });

    it('should return key if message not found', () => {
        expect(pipe.transform('no.label.found')).toEqual('no.label.found');
    });
});
