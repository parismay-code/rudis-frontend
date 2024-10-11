import { createBrowserRouter, Navigate, redirect, RouterProvider, useRouteError } from 'react-router-dom';
import { homePageRoute } from '~pages/home';
import { landingPageRoute } from '~pages/landing';
import { GenericLayout, GuestLayout, NakedLayout } from '~pages/layouts';
import { pathKeys } from '~shared/lib/react-router';
import { notFoundPageRoute } from '~pages/page-404';
import { roomPageRoute } from '~pages/room';
import { unavailableRoute } from '~pages/page-unavailable';
import { GenericError } from '~shared/lib/fetch';

function BubbleError() {
  const error = useRouteError() as GenericError<any>;

  if (error.errorType === 'NETWORK') {
    return <Navigate to={pathKeys.pageBackendIssues()} />;
  } else if (error) {
    throw error;
  }

  return null;
}

const router = createBrowserRouter([
  {
    errorElement: <BubbleError />,
    children: [
      {
        element: <GenericLayout />,
        children: [
          homePageRoute,
          roomPageRoute,
        ],
      },
      {
        element: <GuestLayout />,
        children: [
          landingPageRoute,
        ],
      },
      {
        element: <NakedLayout />,
        children: [
          notFoundPageRoute,
          unavailableRoute,
        ],
      },
      {
        loader: async () => redirect(pathKeys.page404()),
        path: '*',
      },
    ],
  },
]);

export function BrowserRouter() {
  return <RouterProvider router={router} />;
}