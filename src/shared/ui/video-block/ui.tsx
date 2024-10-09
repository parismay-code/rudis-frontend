import { useState } from 'react';
import './styles.scss';

type VideoBlockProps = {
  mediaStream: MediaStream;
  label?: string;
  local?: boolean;
};

export function VideoBlock({ mediaStream, label, local }: VideoBlockProps) {
  const [selfMuted, setSelfMuted] = useState<boolean>(false);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState<boolean>(true);

  return <div className="video-block">
    <video
      className="video-block__source"
      ref={(ref) => {
        if (ref) {
          ref.srcObject = mediaStream;
        }
      }}
      autoPlay
      muted={selfMuted || !!local}
    />

    {label && <span className="video-block__label">{label}</span>}

    <div className="video-block-controls">
      {local && <>
        <button type="button" className="video-block-controls__button" onClick={() => {
          setVideoEnabled((prev) => !prev);

          const track = mediaStream.getVideoTracks()[0];

          track.enabled = !videoEnabled;
        }}>
          {videoEnabled ? 'Выключить видео' : 'Включить видео'}
        </button>

        <button type="button" className="video-block-controls__button" onClick={() => {
          setMicrophoneEnabled((prev) => !prev);

          const track = mediaStream.getAudioTracks()[0];

          track.enabled = !microphoneEnabled;
        }}>
          {microphoneEnabled ? 'Выключить микрофон' : 'Включить микрофон'}
        </button>
      </>}

      {!local && <button type="button" className="video-block-controls__button" onClick={() => {
        setSelfMuted((prev) => !prev);
      }}>
        {selfMuted ? 'Включить звук' : 'Выключить звук'}
      </button>}
    </div>
  </div>;
}