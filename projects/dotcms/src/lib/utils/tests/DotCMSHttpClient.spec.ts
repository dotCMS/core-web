import { DotCMSHttpClient } from '../../utils/DotCMSHttpClient';

describe('DotCMSHttpClient', () => {
    it('should make request with a custom fetch implementation', async () => {
        const fetchObj = { mock: () => {} };
        spyOn(fetchObj, 'mock');

        const httpClient = new DotCMSHttpClient({
            token: '',
            host: 'http://localhost',
            fetch: fetchObj.mock as any
        });

        await httpClient.request({ url: '/test' });
        expect(fetchObj.mock).toHaveBeenCalled();
    });
});
