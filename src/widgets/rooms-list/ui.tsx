import { Room } from '~entities/rooms';
import { RoomBlock } from '~shared/ui/room-block';
import './styles.scss';

type RoomBlockProps = {
  rooms: Room[];
}

export function RoomsList({ rooms }: RoomBlockProps) {
  return <div className="rooms-list">
    {rooms.map((room) => {
      return <RoomBlock key={room.id} room={room} />;
    })}
  </div>;
}