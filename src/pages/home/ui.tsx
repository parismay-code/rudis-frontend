import { withSuspense } from '~shared/lib/react';
import { Loader } from '~widgets/loader';
import { useSuspenseQuery } from '@tanstack/react-query';
import { allRoomsService } from '~entities/rooms';
import { RoomsList } from '~widgets/rooms-list';
import './styles.scss';

function Page() {
  const { data: rooms } = useSuspenseQuery(allRoomsService.queryOptions());

  return <div className="home">
    <section className="home-section">
      <h1 className="home-section__title">Rooms</h1>

      <RoomsList rooms={rooms} />
    </section>
  </div>;
}

export const HomePage = withSuspense(Page, { fallback: <Loader size="medium" /> });