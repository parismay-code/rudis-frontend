import { useEffect, useState } from 'react';

export function useLocalCameraStream() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          displaySurface: 'browser',
        },
        audio: {
          autoGainControl: false,
          echoCancellation: false,
          noiseSuppression: false,
          sampleRate: 48000,
          sampleSize: 16,
        },
      })
      .then((stream) => {
        setLocalStream(stream);

        stream.getVideoTracks()[0].enabled = false;
      });
  }, []);

  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [localStream]);

  return { localStream };
}