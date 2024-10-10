import { useEffect, useState } from 'react';
import { VideoBlock } from '~shared/ui/video-block';
import { MediaStreamData } from '~shared/lib/hooks';
import { sessionService } from '~entities/session';
import { User } from '~entities/users';
import './styles.scss';

type VideosGridProps = {
  localStream: MediaStream | null;
  mediaStreams: Record<string, MediaStreamData>;
}

type Stream = MediaStreamData & { id: string };

export function VideosGrid({ localStream, mediaStreams }: VideosGridProps) {
  const [streams, setStreams] = useState<Stream[]>([]);

  useEffect(() => {
    if (localStream) {
      const user = sessionService.getCache() as User;

      const localStreamData: Stream = { id: 'local', stream: localStream, user: user };
      const remoteStreamsData: Stream[] = Object.entries(mediaStreams).map(([id, mediaStream]) => {
        return { id, ...mediaStream };
      });

      const streams: Stream[] = [localStreamData, ...remoteStreamsData];

      setStreams(streams);
    }
  }, [localStream, mediaStreams]);

  return <div className="videos-grid">
    {streams.map(({ id, stream, user }) => {
      return <VideoBlock
        key={id}
        mediaStream={stream}
        user={user}
        local={id === 'local'}
      />;
    })}
  </div>;
}