import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { pathKeys } from '~shared/lib/react-router';
import { UnavailablePage } from './ui';

export const unavailableRoute: RouteObject = {
  path: pathKeys.pageBackendIssues(),
  element: createElement(UnavailablePage),
};