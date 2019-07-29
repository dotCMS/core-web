import { DotUploadService } from './dot-upload.service';

describe('DotUploadService', () => {
    function FormDataMock() {
        this.append = jest.fn();
    }

    const globalAny: any = global;
    globalAny.FormData = FormDataMock;

    const fetchMock = jest.fn();
    window.fetch = fetchMock;

    const uploadService = new DotUploadService();

    beforeEach(() => {
        fetchMock.mockRejectedValueOnce({});
    });

    it('should send data to the URL endpoint with the correct information', () => {
        uploadService.uploadFile('test');
        const params = fetchMock.mock.calls[0];

        expect(fetchMock.mock.calls.length).toBe(1);
        expect(params[0]).toBe('/api/v1/temp/byUrl');

        // window.fetch = jest.fn();

        // fetchMock.resetMocks();
        //
        //
        //
        //
        //
        // fetchMock.mockImplementationOnce(() =>  new Promise(resolve => {
        //     resolve({ status: 200, json: () => new Promise(res => res({ tempFiles: [{}] })) });
        // }));
        //
        // const uploadService = new DotUploadService();
        // uploadService.uploadFile('test');
        //
        // expect(fetchMock.mock.calls.length).toEqual(1)

        //  fetch.mockResponse()

        //  global

        // window.fetch = jest.fn((url, init) => {
        //     expect(url).toContain('/api/v1/temp/byUrl');
        //     expect(init.body).toEqual(JSON.stringify({ remoteUrl: 'test' }));
        //     // done();
        //     return new Promise(resolve => {
        //         resolve({
        //             status: 200,
        //             json: () =>
        //                 new Promise(res => {
        //                     res({ tempFiles: [{}] });
        //                 })
        //         });
        //     });
        // });

        // jest.spyOn(window, 'fetch').mockImplementation(()=> return new Promise(resolve => {
        //     resolve({
        //         status: 200,
        //         json: () =>
        //             new Promise(res => {
        //                 res({ tempFiles: [{}] });
        //             })
        //     });
        // });)

        // const mockSuccessResponse = {};
        // const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
        // const mockFetchPromise = Promise.resolve({ // 3
        //     status: 200,
        //     json: () => mockJsonPromise,
        // });
        // jest.spyOn(window, 'fetch').mockImplementation(() => mockFetchPromise); // 4
        //
        //
        // window.fetch.call[0]

        // const fakeRes = new Response();
        //
        // console.log(fakeRes);
        //
        // const mockFetchPromise = Promise.resolve(new Response());
        // jest.spyOn(window, 'fetch').mockImplementation(() => mockFetchPromise); // 4
        //
        //
        //

        //
        // console.log('fetch.mock.calls', window.fetch.mock.calls[0][0]);
        // console.log('fetch.mock.calls.length', fetch.mock.calls.length);
        // console.log('fetch.mock', fetch.mock);
    });

    it('should send data to the binary file endpoint with the correct information', done => {
        const b = jest.fn();

        window.fetch = b; //jest.fn().mockRejectedValueOnce(10);

        b.mockRejectedValueOnce('test');

        window.FormData = {};

        const uploadService = new DotUploadService();
        uploadService.uploadFile({});

        console.log(b.mock.calls[0]);
        expect(b.mock.calls.length).toBe(1);

        // window.FormData = {};
        //
        // window.fetch = jest.fn((url, init) => {
        //     expect(url).toContain('/api/v1/temp');
        //     // expect(init.body).toEqual(JSON.stringify({ remoteUrl: 'test' }));
        //     done();
        //     return new Promise(resolve => {
        //         resolve({ status: 200, json: () => new Promise(res => res({ tempFiles: [{}] })) });
        //     });
        // });
        //
        // const uploadService = new DotUploadService();
        // uploadService.uploadFile({});
    });

    /*it('should get data from the endpoint', done => {
        // const fetch = jest.fn(
        //     (url, init) =>
        //         new Promise(resolve => {
        //             resolve({ status: 200, tempFiles: [{ test: 'test' }] });
        //         })
        // );
        //
        // const fetch = jest.fn((url, init) => {
        //     console.log(url);
        //     console.log(init);
        // });

        // console.log('someting');
        // const fetch = jest.fn((url, init) => {
        //     console.log('someting');
        //     return new Promise(resolve => {
        //         console.log(url);
        //         console.log(init);
        //         resolve({ status: 200 });
        //     });
        // });

        window.fetch = jest.fn((url, init) => {
            console.log(url);
            console.log(init);
            return new Promise(resolve => {
                resolve({ status: 200, json: () => new Promise(res => res({tempFiles: [{}]})) });
            });
        });

        // const fetch = jest.fn((url, init) => {
        //     return { status: 200 };
        // });

        console.log('test');
        // }).then(async (response: Response) => {
        //     if (response.status === 200) {
        //         return (await response.json()).tempFiles[0];
        //     } else {
        //         const error: DotHttpErrorResponse = {
        //             message: (await response.json()).message,
        //             status: response.status
        //         };
        //         throw error;
        //     }
        // });
        // const mockJsonResponse = Promise.resolve({ tempFiles: { data: 'test' } });
        // const mockFetchPromise = Promise.resolve({ json: () => mockJsonResponse });
        //
        // jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

        const uploadService = new DotUploadService();

        // uploadService.uploadFile('test').then();
        //
        // console.log('fetch.mock.calls.length', fetch.mock.calls.length);
        // console.log('fetch.mock', fetch.mock);

        //done();

        uploadService.uploadFile('test').then(data => {
            console.log('data', data);

            // expect(fetch.mock.calls.length)
            done();
        });
        // expect(window.fetch.mock.calls[0][0])

        expect(window.fetch.mock.calls[0][0]).toContain('/api/v1/temp/byUrl');

        console.log('fetch.mock.calls', window.fetch.mock.calls[0][0]);
        console.log('fetch.mock.calls.length', fetch.mock.calls.length);
        console.log('fetch.mock', fetch.mock);
    });*/
});
