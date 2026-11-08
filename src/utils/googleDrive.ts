export function getGoogleDriveImageUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== 'drive.google.com') return url;

    const fileId = parsedUrl.pathname.match(/^\/file\/d\/([^/]+)/)?.[1]
      || parsedUrl.searchParams.get('id');
    return fileId
      ? `https://lh3.googleusercontent.com/d/${encodeURIComponent(fileId)}=w1600`
      : url;
  } catch {
    return url;
  }
}
