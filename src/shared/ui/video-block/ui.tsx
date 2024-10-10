import { useState } from 'react';
import { RoomUser, useSpeakingState } from '~shared/lib/hooks';
import { User } from '~entities/users';
import { UserBlock } from '~widgets/user-block';
import camOn from '~shared/assets/cam-on.svg';
import camOff from '~shared/assets/cam-off.svg';
import micOn from '~shared/assets/microphone-on.svg';
import micOff from '~shared/assets/microphone-off.svg';
import soundOn from '~shared/assets/sound-on.svg';
import soundOff from '~shared/assets/sound-off.svg';
import './styles.scss';

type VideoBlockProps = {
  mediaStream: MediaStream;
  user: RoomUser | User;
  local?: boolean;
};

export function VideoBlock({ mediaStream, local, user }: VideoBlockProps) {
  const [selfMuted, setSelfMuted] = useState<boolean>(false);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState<boolean>(true);

  const speaking = useSpeakingState(mediaStream, 1024);

  return <div className="video-block">
    <video
      className="video-block__source"
      ref={(ref) => {
        if (ref) {
          ref.disablePictureInPicture = true;
          ref.srcObject = mediaStream;
        }
      }}
      autoPlay
      muted={selfMuted || local}
    />

    <div className="video-block__data">
      <UserBlock user={user} speaking={speaking} />

      <div className="video-block-controls">
        {local && <>
          <button type="button" className="video-block-controls__button" onClick={() => {
            setVideoEnabled((prev) => !prev);

            const track = mediaStream.getVideoTracks()[0];

            track.enabled = !videoEnabled;
          }}>
            {videoEnabled && <img src={camOn} alt="Выключить видео" />}
            {!videoEnabled && <img src={camOff} alt="Включить видео" />}
          </button>

          <button type="button" className="video-block-controls__button" onClick={() => {
            setMicrophoneEnabled((prev) => !prev);

            const track = mediaStream.getAudioTracks()[0];

            track.enabled = !microphoneEnabled;
          }}>
            {microphoneEnabled && <img src={micOn} alt="Выключить микрофон" />}
            {!microphoneEnabled && <img src={micOff} alt="Включить микрофон" />}
          </button>
        </>}

        {!local && <button type="button" className="video-block-controls__button" onClick={() => {
          setSelfMuted((prev) => !prev);
        }}>
          {!selfMuted && <img src={soundOn} alt="Выключить звук" />}
          {selfMuted && <img src={soundOff} alt="Включить звук" />}
        </button>}
      </div>
    </div>
  </div>;
}