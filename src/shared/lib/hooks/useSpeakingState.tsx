import { useEffect, useRef, useState } from 'react';

type FftSize =
  | 32
  | 64
  | 128
  | 256
  | 512
  | 1024
  | 2048
  | 4096
  | 8192
  | 16384
  | 32768;

export function useSpeakingState(source: MediaStream, fftSize: FftSize = 1024, minDecibels: number = -30, maxDecibels: number = 90) {
  const [speaking, setSpeaking] = useState<boolean>(false);

  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!source) return;

    const audioContext = new AudioContext();
    const analyser = new AnalyserNode(audioContext, { fftSize, minDecibels, maxDecibels });

    const audioSource = audioContext.createMediaStreamSource(source);
    audioSource.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let audioCancel = 0;

    update();

    function update() {
      analyser.getByteTimeDomainData(dataArray);

      const sum = dataArray.reduce((a, b) => a + b, 0);

      if (sum / dataArray.length / 128.0 > 1) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        setSpeaking(true);
        timeoutRef.current = setTimeout(() => {
          setSpeaking(false);
          timeoutRef.current = undefined;
        }, 1000);
      }

      audioCancel = requestAnimationFrame(update);
    }

    return () => {
      cancelAnimationFrame(audioCancel);
      audioCancel = 0;
      setSpeaking(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [source, fftSize, minDecibels, maxDecibels]);

  return speaking;
}