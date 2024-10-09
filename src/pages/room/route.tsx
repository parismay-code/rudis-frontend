import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { pathKeys } from '~shared/lib/react-router';
import { RoomPage } from './ui';
import { sessionService } from '~entities/session';

export const roomPageRoute: RouteObject = {
  path: pathKeys.room.mask(),
  element: createElement(RoomPage),
  loader: async (args) => {
    await Promise.all([sessionService.prefetchQuery()]);

    return args;
  },
};