import { Link } from 'react-router-dom';
import { Room } from '~entities/rooms';
import { pathKeys } from '~shared/lib/react-router';
import './styles.scss';

type RoomBlockProps = {
  room: Room;
}

export function RoomBlock({ room }: RoomBlockProps) {
  return <div className="room-block">
    <h1 className="room-block__title">{room.name}</h1>

    {room.description && <p className="room-block__description">{room.description}</p>}

    <Link to={pathKeys.room.root(room.id)} className="room-block__link">Войти</Link>
  </div>;
}