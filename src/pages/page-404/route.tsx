import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { pathKeys } from '~shared/lib/react-router';
import { NotFoundPage } from './ui';

export const notFoundPageRoute: RouteObject = {
  path: pathKeys.page404(),
  element: createElement(NotFoundPage),
};