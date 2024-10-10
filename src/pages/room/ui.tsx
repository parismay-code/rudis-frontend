import { useRoomConnection } from '~shared/lib/hooks';
import { VideosGrid } from '~widgets/videos-grid';
import { Messages } from '~widgets/messages';
import './styles.scss';

export function RoomPage() {
  const { localStream, mediaStreams, messages } = useRoomConnection();

  return <div className="room">
    <VideosGrid localStream={localStream} mediaStreams={mediaStreams} />

    <Messages messages={messages} />
  </div>;
}