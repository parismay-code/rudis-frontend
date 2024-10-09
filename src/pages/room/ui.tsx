import { useRoomConnection } from '~shared/lib/hooks';
import './styles.scss';
import { VideosGrid } from '~widgets/videos-grid';

export function RoomPage() {
  const { localStream, mediaStreams } = useRoomConnection();

  return <div className="room">
    <VideosGrid localStream={localStream} mediaStreams={mediaStreams} />
  </div>;
}