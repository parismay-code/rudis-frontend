import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { sessionService } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';
import { HomePage } from './ui';

export const homePageRoute: RouteObject = {
  path: pathKeys.home(),
  element: createElement(HomePage),
  loader: async (args) => {
    await Promise.all([sessionService.prefetchQuery()]);

    return args;
  },
};