import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { pathKeys } from '~shared/lib/react-router';
import { LandingPage } from './ui';

export const landingPageRoute: RouteObject = {
  path: pathKeys.landing(),
  element: createElement(LandingPage),
};