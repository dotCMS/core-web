export class DotEventsSocketURL {
    constructor(private url: string, private useSSL: boolean) {

    }

    public getWebSocketURL(): string {
        return `${this.getWebSocketProtocol()}://${this.url}`;
    }

    public getLongPoolingURL(): string {
        return `${this.getHttpProtocol()}://${this.url}`;
    }

    private getWebSocketProtocol(): string {
        return `${this.useSSL ? 'wss' : 'ws'}`;
    }

    private getHttpProtocol(): string {
        return `${this.useSSL ? 'https' : 'http'}`;
    }
}
