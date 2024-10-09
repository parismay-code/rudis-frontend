import { Navigate, Outlet } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';
import { sessionService } from '~entities/session';
import './styles.scss';
import { pathKeys } from '~shared/lib/react-router';

function Layout() {
  return (
    <>
      <div className="header">Header</div>
      <div className="container">
        <Outlet />
      </div>
    </>
  );
}

export function GenericLayout() {
  const { data: user } = useSuspenseQuery(sessionService.queryOptions());

  if (!user) {
    return <Navigate to={pathKeys.landing()} />;
  }

  return <Layout />;
}

export function GuestLayout() {
  return <Layout />;
}

export function NakedLayout() {
  return <Outlet />;
}