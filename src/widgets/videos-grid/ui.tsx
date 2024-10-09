import { VideoBlock } from '~shared/ui/video-block';
import './styles.scss';

type VideosGridProps = {
  localStream: MediaStream | null;
  mediaStreams: Record<string, MediaStream>;
}

export function VideosGrid({ localStream, mediaStreams }: VideosGridProps) {
  return <div className="videos-grid">
    {localStream && <VideoBlock
      local
      mediaStream={localStream}
      label="Это вы"
    />}

    {Object.entries(mediaStreams).map(([id, stream], key) => {
      return <VideoBlock
        key={id}
        mediaStream={stream}
        label={`Это игрок ${key + 1}`}
      />;
    })}
  </div>;
}