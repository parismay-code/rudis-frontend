import { useRoomConnection } from '~shared/lib/hooks';
import { VideosGrid } from '~widgets/videos-grid';
import './styles.scss';

export function RoomPage() {
  const { localStream, mediaStreams, messages } = useRoomConnection();

  console.log(messages);

  return <div className="room">
    <VideosGrid localStream={localStream} mediaStreams={mediaStreams} />
  </div>;
}