export function stream(): Promise<MediaStream> {
  return new Promise<MediaStream>((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        resolve(stream);
      })
      .catch(reject);
  });
}