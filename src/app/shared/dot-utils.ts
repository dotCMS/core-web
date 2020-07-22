export function dotDownloadBlobFile(blob: Blob, fileName: string): void {
    // This approach is needed because FF do not hear WS events while waiting for a request.
    const anchor = document.createElement('a');
    anchor.download = fileName;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.click();
}
